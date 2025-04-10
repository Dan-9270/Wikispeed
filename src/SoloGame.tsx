import benjamin from './assets/monster/benjamin.png';
import {ArticleList, Inventory, Timer} from './component/EventComponent';
import './style/wikispeed.css';
import './style/timer.css';
import './style/game.css';
import {ArticleDisplayer} from './component/Article';
import {Background} from "./assets/back.tsx";
import {useState ,useEffect} from 'react';
import type {Player} from './types/Player.ts';
import {Game} from './Game.tsx';
import {createPortal} from 'react-dom';
import {Artifact, ArtifactPopup} from './component/Artifact.tsx';
import gomme from './assets/artifact/gomme.svg';
import desorienter from './assets/artifact/compass.svg';
import dictateur from './assets/artifact/dictateur.svg';
import back from './assets/artifact/back.svg';
import mine from './assets/artifact/mine.svg';
import snail from './assets/artifact/escargot.svg';
import teleporteur from './assets/artifact/teleporteur.svg';
import { MusicPlayer } from './component/MusicComponent'


function SoloGame(props: { game: Game; onChange: (newGame: Game) => void; onChangeGameState: (state: string) => void }) {
  const [popupDisplay, setPopupDisplay] = useState<popup|null>(null);
  const { artefacts, temps } = props.game.settings;
  const soloPlayer = props.game.players[0];

  function addToInventory(Artifact: number) {
    if(soloPlayer.inventory.length==2 || soloPlayer.inventory.includes(Artifact)){
      const newPlayer: Player = {
        ...soloPlayer,
        currentArtefact:0,
      };
      props.onChange({
        ...props.game,
        players: [newPlayer],
      });
      return;
    }
    const newPlayer: Player = {
      ...soloPlayer,
      currentArtefact:0,
      inventory:[...soloPlayer.inventory,Artifact],
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });
  }
  const artefactList: Artifact[] = [    {
    name: "Retour en arrière",
    description: "Vous fait revenir sur la page précédente.",
    img: back,
    onActivate: backArtifact
  },
    {
    name: "Mine",
    description: "Pose la mine ou tu le souhaites et piège tes adversaires",
    img: mine,
    onActivate: placemine
  },
  {
    name: "Téléporteur",
    description: "Vous téléporte sur un article à 2 liens d'un article a trouver",
    img: teleporteur,
    onActivate: teleporter
  },
    {
      name: "Escargot",
      description: "La malédiction de l'escargot a frappé ! Vous ne pouvez plus changer de page pendant 1 minute.",
      img: snail,
      onActivate:startSnail
    },
    {
      name: "Dictateur",
      description: "Le dictateur vous donne un ordre, vous rendre sur un des articles cible et ignorer les autres.",
      img: dictateur,
      onActivate: dictator
    },
    {
      name: "Gomme",
      description: "Supprime le dernier article trouvé de la liste !",
      img: gomme,
      onActivate: eraser
    },
    {
      name: "Désorienteur",
      description: "Vous téléporte aléatoirement sur wikipedia, laissez parler votre chance",
      img: desorienter,
      onActivate: disorienter
    }
  ];
  const popupList:popup[]=[
    {
      name: "Retour a été ajouté a votre inventaire",
      image: back,
      message: "Un bouton de retour a été ajouté a votre inventaire, utilisez le pour retourner sur l'article précédent",
      onclose: undefined,
    },
    {
      name: "Mine a été ajouté a votre inventaire",
      image: mine,
      message: "Une mine a été ajouté a votre inventaire, posez la pour miner le terrain de vos adversaires",
      onclose: undefined,
    },   
    {
        name: "Téléporteur",
        image: teleporteur,
        message: "Vous venez d'activer le téléporteur, vous allez être téléporté à 2 liens de l'article : ",
        onclose: undefined,

    },
    {
      name: "Escargot a été activé !",
      image: snail,
      message: "La malédiction de l'escargot vient de frapper ! Vous êtes aussi lent que lui et vous ne pouvez plus changer d'article pendant 1 minutes, prenez le temps de réfléchir.",
      onclose: undefined,
    },
    {
      name: "Dictateur a été activé !",
      image: dictateur,
      message: "Le Dictateur a parlé, vous devez vous rendre sur l'article : " + props.game.players[props.game.currentPlayer].dictator + ", votre liste d'articles ne sera plus mise à jour tant que le dictateur ne sera pas satisfait !",
      onclose: undefined,
    },
    {
      name: "Gomme a été activé !",
      image: gomme,
      message: "Pas de chance, la Gomme viens d'être activté, vous avez perdu votre dernier article trouvé !",
      onclose: undefined
    },
    {
      name: "Désorienteur a été activé !",
      image: desorienter,
      message: "Le Désorienteur vient de s'activer, vous allez être amené vers un article aléatoire, bonne chance !",
      onclose: undefined,
    }
  ]
  const fetchArticleLinks = async (soloPlayerHistory: string[]) => {
    try {
      const lastVisited = soloPlayerHistory[soloPlayerHistory.length - 1];
      const articleList = await extractArticleLinks(lastVisited);
      if (articleList.length === 0) {
        addToInventory(1);
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchArticleLinks(soloPlayer.history);
  }, [soloPlayer.history]);
  //DETECTION DES ARTÉFACTS EN COURS
  const currentArtefactIndex=soloPlayer.currentArtefact;

  useEffect(() => {
    if (currentArtefactIndex !== 0 && artefactList[currentArtefactIndex - 1] !== undefined) {
      const artefact = artefactList[currentArtefactIndex - 1];

      if (popupDisplay === null) {
        if (currentArtefactIndex === 1 || currentArtefactIndex === 2 || currentArtefactIndex === 3 ) {
          if(!soloPlayer.inventory.includes(currentArtefactIndex)){
            setPopupDisplay(popupList[currentArtefactIndex - 1]);
            addToInventory(currentArtefactIndex);
          }
          else{
            const newPlayer: Player = {
              ...soloPlayer,
              currentArtefact:0,
            };
            props.onChange({
              ...props.game,
              players: [newPlayer],
            });
          }

        } else if (artefact.onActivate !== undefined) {
          setPopupDisplay(popupList[currentArtefactIndex - 1]);
          artefact.onActivate();
        }
      }
    }
  }, [currentArtefactIndex, popupDisplay,addToInventory,artefactList,popupList,soloPlayer.inventory,props,soloPlayer]);


  const updateHistoryAndMap = async (articleTitle: string) => {
    const newHistory = soloPlayer.history ? [...soloPlayer.history, articleTitle] : [articleTitle];
    const newArticles = new Map(soloPlayer.articles);
    const value = newArticles.get(articleTitle);
    props.game.players[props.game.currentPlayer].dictator = null;
    let x=0;
    if(!props.game.players[props.game.currentPlayer].history.includes(articleTitle)){
      x = await generationArtefacts(articleTitle.replace(/ /g, "_"));
      console.log(x);
    }

    if (value !== undefined && !value) {
      newArticles.set(articleTitle, true);
    }
    const newPlayer: Player = {
      ...soloPlayer,
      history: newHistory,
      articles: newArticles,
      currentArtefact:x
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });
  };
  function startSnail(){
    const newPlayer: Player = {
      ...soloPlayer,
      snail :Date.now(),
      currentArtefact:0
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });

  }
  const resetSnail=()=>{
    const newPlayer: Player = {
      ...soloPlayer,
      snail :null
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });
  }

  function updateHistory(articleTitle: string) {
    const player = props.game.players[props.game.currentPlayer];

    const updatedHistory = player.history ? [...player.history, articleTitle] : [articleTitle];

    props.onChange({
      ...props.game,
      players: [
        {
          ...player,
          history: updatedHistory,
        },
      ],
    });
  }

  if (soloPlayer.articles && Array.from(soloPlayer.articles.values()).every(value => value === true)) {
    props.onChangeGameState("endgame");
  }

  // FONCTION ARTEFACTS
  function randomMalus(probability:number) {
    const rand = Math.random();
    if (rand < 1 - probability) {
      return 0;
    }

    const min = 4;
    const max = artefactList.length;
    const range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }

  function randomBonus(probability:number) {
    const rand = Math.random();

    if (rand < 1 - probability) {
      return 0;
    }
    const min = 1;
    const max = 3;
    const range = max - min + 1;
    return Math.floor(Math.random() * range) + min;
  }

  async function generationArtefacts(title: string) {
    const popularity = await fetchArticlePopularity(title);
    if (popularity == null) {
      return 0;
    }
    else {
      const medianePopularity = popularity.firstArticlePopularity / 800;
      const difference = popularity.articlePopularity - medianePopularity;
      const absoluteDifference = Math.abs(difference);
      const probability = (absoluteDifference / medianePopularity)/4 ;
      if (difference > 0) {
        return randomMalus(probability);
      } else {
        return randomBonus(probability);
      }
    }
  }




  const fetchArticlePopularity = async (title: string) => {
    try {
      const query = `http://localhost:3001/articles?title=${title}`;
      const response = await fetch(query);
      const data = await response.json();

      if (data && data.articlePopularity !== null) {
        return data;
      } else {
        return 0;
      }
    } catch {
      return null;
    }
  };

  interface popup {
    name: string;
    image: string;
    message: string;
    onclose: undefined;
  }


  function backArtifact() {
    const newInventory = soloPlayer.inventory.filter(item => item !== 1);

    const articleTitle=props.game.players[props.game.currentPlayer].history.slice(-2)[0]
    const newHistory = soloPlayer.history ? [...soloPlayer.history, articleTitle] : [articleTitle];
    const newArticles = new Map(soloPlayer.articles);
    const value = newArticles.get(articleTitle);
    props.game.players[props.game.currentPlayer].dictator = null;
    setPopupDisplay({
          name: "Retour a été activé !",
          image: back,
          message: "Vous venez d'activer le retour en arrière, vous venez de remonter dans le temps",
          onclose: undefined,
        })
    if (value !== undefined && !value) {
      newArticles.set(articleTitle, true);
    }
    const newPlayer: Player = {
      ...soloPlayer,
      history: newHistory,
      articles: newArticles,
      inventory: newInventory
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });

  }

  function eraser() {
    if (1 == 1) {
      for (let i = props.game.players[props.game.currentPlayer].history.length - 1; i >= 0; i--) {
        const articleTitle = props.game.players[props.game.currentPlayer].history[i];

        if (props.game.players[props.game.currentPlayer].articles.get(articleTitle)) {
          const updatedArticles = new Map(props.game.players[props.game.currentPlayer].articles);
          updatedArticles.set(articleTitle, false);

          props.onChange({
            ...props.game,
            players: [
              {
                ...props.game.players[props.game.currentPlayer],
                articles: updatedArticles,
                currentArtefact:0
              },
            ],
          });
          break;
        }
      }
    }
  }

  async function disorienter() {
    if (1 == 1) {
      const response = await fetch("https://fr.wikipedia.org/api/rest_v1/page/random/summary");
      const data = await response.json();
      const articleTitle=data.title;

      const newHistory = soloPlayer.history ? [...soloPlayer.history, articleTitle] : [articleTitle];
      const newArticles = new Map(soloPlayer.articles);
      const value = newArticles.get(articleTitle);
      props.game.players[props.game.currentPlayer].dictator = null;
      if (value !== undefined && !value) {
        newArticles.set(articleTitle, true);
      }
      const newPlayer: Player = {
        ...soloPlayer,
        history: newHistory,
        articles: newArticles,
        currentArtefact:0
      };
      props.onChange({
        ...props.game,
        players: [newPlayer],
      });
    }
  }

  function dictator() {
    const articlesMap = new Map(props.game.players[props.game.currentPlayer].articles);

    if (1 == 1) {
      if (!props.game.players[props.game.currentPlayer].dictator) {
        const availableTitles = props.game.settings.wordsList.filter(
            (title) => !articlesMap.get(title)
        );

        if (availableTitles.length > 0) {
          const randomTitle = availableTitles[Math.floor(Math.random() * availableTitles.length)];
          props.game.players[props.game.currentPlayer].dictator = randomTitle;

          const newPlayer = {
            ...props.game.players[props.game.currentPlayer],
            dictator: randomTitle,
            currentArtefact:0
          };

          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }
      }
    }

  }

  function dictatorUpdate(currentTitle: string) {
    if (currentTitle == props.game.players[props.game.currentPlayer].dictator) {
      updateHistoryAndMap(currentTitle);
    } else {
      updateHistory(currentTitle);
    }
  }
  
  async function teleporter() {
    const player = props.game.players[props.game.currentPlayer];
    const availableTitles = props.game.settings.wordsList.filter(
      (title) => !player.articles.get(title)
    );

    if (availableTitles.length > 0) {

      const randomTarget = availableTitles[Math.floor(Math.random() * availableTitles.length)];
      const currentArticle = player.history[player.history.length - 1];

      try {
        const response = await fetch(`http://localhost:3001/solve?start_id=${encodeURIComponent(currentArticle)}&target_id=${encodeURIComponent(randomTarget)}`);
        const data = await response.json();

        if (data && data.Path && data.Path.length >= 2) {
          const length = data.Path.length;
          if(length < 4) {
            setPopupDisplay({
              name: "Téléporteur",
              image: teleporteur, 
              message: `Vous n'avez été téléporté vers l'article car vous en êtes trop proche`,
              onclose: undefined,
            });
            return;
          }
          setPopupDisplay({
            name: "Téléporteur",
            image: teleporteur,
            message: "Vous venez d'activer le téléporteur, vous allez être téléporté à 2 liens de l'article : ",
            onclose: undefined,
          })
          const teleportArticle = data.Path[length - 3];

          const newHistory = player.history ? [...player.history, teleportArticle] : [teleportArticle];
          const newArticles = new Map(player.articles);
          const value = newArticles.get(teleportArticle);

          if (value !== undefined && !value) {
            newArticles.set(teleportArticle, true);
          }

          const newInventory = soloPlayer.inventory.filter(item => item !== 3);

          const newPlayer: Player = {
            ...player,
            history: newHistory,
            articles: newArticles,
            inventory: newInventory,
            currentArtefact: 0,
          };

          props.onChange({
            ...props.game,
            players: [newPlayer],
          });

          /*setPopupDisplay({
            name: "Téléporteur",
            image: "path/to/teleporter/image.svg", // Replace with the actual image path
            message: `Vous avez été téléporté vers l'article : ${teleportArticle}`,
            onclose: undefined,
          });*/
        }
      } catch (error) {
        console.error("Erreur lors de l'utilisation du téléporteur :", error);
      }
    }
  }

//   async function gps() {
//     const player = props.game.players[props.game.currentPlayer];
//     const availableTitles = props.game.settings.wordsList.filter(
//       (title) => !player.articles.get(title)
//     );

//     if (availableTitles.length > 0) {
     
//       for(let i = 0; i < availableTitles.length; i++) {
//         const articleTitle = availableTitles[i];
//         const currentArticle = player.history[player.history.length - 1];
//         console.log("Response:", `http://localhost:3001/solve?start_id=${encodeURIComponent(currentArticle)}&target_id=${encodeURIComponent(articleTitle)}`);
//         const response = await fetch(`http://localhost:3001/solve?start_id=${encodeURIComponent(currentArticle)}&target_id=${encodeURIComponent(articleTitle)}`);
//         const data = await response.json();
//         console.log("dara",data)
//         const pathAsList = (data.path);
//         console.log("Parsed Path:", pathAsList);
//       }
//   }
// }
  const extractArticleLinks = async (title: string): Promise<string[]> => {
    try {
      const response = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/html/${title}`);
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'article : ${response.statusText}`);
      }
      const htmlContent = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      const sectionsToRemove = [
        "Notes_et_références",
        "Annexes",
        "Voir_aussi",
        "Bibliographie",
        "Références",
        "Liens_externes",
        "Articles_connexes"
      ];
      sectionsToRemove.forEach(sectionId => {
        const section = doc.getElementById(sectionId);
        if (section) section.remove();
      });
      const allLinks = doc.querySelectorAll('a[title]');
      const articleTitles: string[] = [];
      allLinks.forEach((link) => {
        const title = link.getAttribute('title');
        if (title) {
          articleTitles.push(title);
        }
      });

      return articleTitles;

    } catch (error) {
      return [];
    }
  };
  async function placemine() {
    setPopupDisplay({
      name: "Vous avez posez une mine.",
      image: mine,
      message: "Cet article et tout les articles vers lequel il renvoie seront piégé pour vos adversaires",
      onclose: undefined,
    })
    const player = props.game.players[props.game.currentPlayer];

    const previousMined = props.game.mined;
    const newMined = new Map(previousMined);
    const currentList = newMined.get(props.game.currentPlayer) || [];

    const lastHistory = player.history[player.history.length - 1];

    try {
      const articleLinks = await extractArticleLinks(lastHistory);


      newMined.set(props.game.currentPlayer, [...currentList, [lastHistory, ...articleLinks]]);
      const newInventory = soloPlayer.inventory.filter(item => item !== 2);
      const newPlayer = {
        ...props.game.players[props.game.currentPlayer],
        inventory: newInventory,
      };
      props.onChange({
        ...props.game,
        players:[newPlayer],
        mined: newMined,
      });
    } catch (error) {
    }
  }
  function mined(newMined : Map<number,string[][]>) {
    setPopupDisplay({
      name: "Mine a été activé !",
      image: mine,
      message: "Igo, le terrain est miné, pour de vrai, pour de vrai, le terrain est miné\n" +
          "Faut tailler, nous, on est loin d'l'époque où fallait détailler\n" +
          "Maintenant, il m'faut des factures détaillées, hum\n" +
          "Ça sentait toujours la caille, les taudis, les RS, les RS, les Cayenne\n" +
          "Les petits, ils oublient d'respecter les doyens, les doyens, ils oublient d'respecter les petits",
      onclose: undefined,
    })
    let target = null;
    for (let i = 5; i >= 1; i--) {
      const index = soloPlayer.history.length - i;
      if (index >= 0) {
        target = soloPlayer.history[index];
        break;
      }
    }

    if (target) {
      props.onChange({
        ...props.game,
        mined: newMined,
        players: [
          {...props.game.players[props.game.currentPlayer],
            history: [...props.game.players[props.game.currentPlayer].history,target],
          },
        ],
      });
    }

  }
  return (
      <>
        <section className='main-page game'>
          <figure className='logo-solo'>
            <svg width="30vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 400">
              <polygon points="40,10 130,1 70,160 100,160 5,390 35,200 0,200" stroke="#000000" stroke-width="7px" fill="#FDB813" />
            </svg>
          </figure>
          <div className='game-container'>
            <div className='game-info'>
              <Timer
                  deadlineMillis={temps !== undefined ? (props.game.startTime !== undefined ? props.game.startTime + temps * 60000 : undefined) : undefined}
                  onTimeUp={() => {
                    props.onChangeGameState("endgame");
                    props.onChange({
                      ...props.game,
                      end: true,
                    });
                  }}
              />
            </div>
            <div className='game-main'>
              <ArticleDisplayer title={props.game.players[props.game.currentPlayer].history.slice(-1)[0]} updateHistoryAndMap={props.game.players[props.game.currentPlayer].dictator !== null ? dictatorUpdate : updateHistoryAndMap} snail={soloPlayer.snail} resetSnail={resetSnail} mined={props.game.mined} triggerMined={mined} currentPlayer={props.game.currentPlayer} />
              <div className='game-main-details'>
                <ArticleList names={props.game.players[props.game.currentPlayer].articles} dictatorWord={props.game.players[props.game.currentPlayer].dictator} />
                <figure className="monster"><img src={benjamin} alt="benjamin" /></figure>
              </div>
            </div>
            <div className='game-bottom'>
              <div className="bottom_bar">
                <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bl'><path d="M0 0H114C54.5 26 66 72 66 72H0V0Z" fill=" #4943C6" /></svg>
                <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='br'><path d="M114 0H0C59.5 26 48 72 48 72H114V0Z" fill=" #4943C6" /></svg>
              </div>
              <svg width="225" height="100" viewBox="0 0 225 73" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bb'><path d="M111.675 -0.000378409C165.925 0.28796 237 19.4997 222 71.4994C206.999 123.499 165.925 114.16 111.674 113.872C57.4239 113.584 22.5001 123 2.99974 71.4993C-12 19 57.4247 -0.288717 111.675 -0.000378409Z" fill=" #4943C6" /></svg>

              <Inventory
                  artifact1={artefactList[soloPlayer.inventory[0] - 1] || null}
                  artifact2={artefactList[soloPlayer.inventory[1] - 1] || null}
                  isExist={artefacts}
              />

            </div>
          </div>
        </section>
        <Background />
        <MusicPlayer/>

        {popupDisplay !== null && createPortal(
            <ArtifactPopup
                artifactName={popupDisplay.name}
                artifactImage={popupDisplay.image}
                message={popupDisplay.message}
                onClose={() => {
                  setPopupDisplay(null);
                }}
            />,
            document.body
        )}

        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:0,
          inventory:[],
          snail:null
        };

          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>
          RESET
        </button>

        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:3,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

          Teleporteur
        </button>
        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:1,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

          Back
        </button>
        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:2,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

          Mine
        </button>
        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:4,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

          snail
        </button>        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:5,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

          dictateur
        </button>
        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:6,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

gomme
        </button>

        <button onClick={() => { const newPlayer = {
          ...props.game.players[props.game.currentPlayer],
          dictator:null,
          currentArtefact:7,
          snail:null
        };
          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }}>

disorienter
        </button>
        ²<p>{soloPlayer.currentArtefact}</p>

      </>
  );
}



export default SoloGame;

