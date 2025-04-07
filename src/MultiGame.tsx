import Damien from "./assets/avatar/Avatar_damien.svg";
import {ChatBox, FinChatter} from "./component/Chat.tsx";
import { ArticleList, Inventory, PlayerInfo, Timer } from './component/EventComponent'
import './style/wikispeed.css'
import './style/timer.css'
import './style/game.css'
import { ArticleDisplayer } from './component/Article'
import { Background } from "./assets/back.tsx";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sharedChatManager } from "./chatManager.ts";
import { Player } from "./types/Player.ts";
import { ArtifactPopup } from "./component/Artifact.tsx";
import { createPortal } from "react-dom";
import back from './assets/artifact/back.svg';
import gomme from './assets/artifact/gomme.svg';
import desorienter from './assets/artifact/compass.svg';
import dictateur from './assets/artifact/dictateur.svg';
import mineImg from './assets/artifact/mine.svg';
import map from './assets/artifact/map.svg';
import snail from './assets/artifact/escargot.svg';
import { MusicPlayer } from './component/MusicComponent'




function MultiGame() {
  const location = useLocation();
  const formData = location.state.parameters;
  const username = location.state.userName;
  const avatar = location.state.img;
  const map = location.state.playerMap;
  const players = location.state.players;
 // console.log("map:", map);
 
    // Si les données sont absentes ou invalides, redirige l'utilisateur ou montre un message d'erreur
    if (!formData) {
      return <div>Erreur: Aucune donnée trouvée.</div>;
    }
    
    // console.log("formData:", formData);

    const { nombreArticles, artefacts, temps, randomMots, choixMots, wordsList } = formData;
     
    const duration = temps === -1 ? undefined : temps
    if(nombreArticles===0){
      console.log(formData);
      return <div>Loading.</div>;
    }else{
    useEffect(() => {
      console.log("Données reçues:", formData);
      if (choixMots) {
        setArticleTitle(choixMots);
      }
    }, [formData]);
  
    const articlesMap: Map<string, boolean> = new Map(wordsList.map((article: string) => [article, false]));
    const randomTitle = wordsList.length > 0 ? wordsList[Math.floor(Math.random() * wordsList.length)] : "Aucun mot disponible";
    
    const [articleTitle, setArticleTitle] = useState(randomTitle);
    const [isOver, setIsOver] = useState(false);
    const [isEnd, setEndGame] = useState(false);
    const [listPlayer, setListPlayer] = useState<Player[]>([]);
    const [hasSnailArtifact, setHasSnailArtifact] = useState(false);

    const [mine, setMine] = useState<Map<number,string[][]>>(new Map());


    const [player,setPlayer] = useState<Player>({
      id:0,
      name:username,
      time:200,
      avatar:avatar,
      score:20,
      history:[randomTitle],
      articles:articlesMap.set(randomTitle, true) ,
      dictator: null,
      snail: null,
    });
    const navigate = useNavigate();

    const getPlayerIdByName = (playersMap: Map<number, string>, name: string): number  => {
      for (const [id, playerName] of playersMap.entries()) {
        if (playerName === name) {
          return id; // Retourne l'identifiant trouvé
        }
      }
      return -1// Retourne undefined si le joueur n'est pas trouvé
    };
  

    const updateHistoryAndMap = (articleTitle: string) => {
      const newHistory = player.history ? [...player.history, articleTitle] : [articleTitle];
      const newArticles = new Map(player.articles);
      const value = newArticles.get(articleTitle);
      
      console.log("aaaaaaaaaaaaaaaa");
      if (value !== undefined && !value) {
        newArticles.set(articleTitle, true);
      }
      const newPlayer: Player = {
        ...player,
        dictator: null,
        history: newHistory,
        articles: newArticles,
      };

      setPlayer(newPlayer);
      
    };

    
    useEffect(() => {
      const allArticlesFound = Array.from(player.articles.values()).every(status => status === true);
      if (allArticlesFound) {
        sharedChatManager.sendFinishGame();
        
      }
   
    }, [player.articles, navigate]);
 
    useEffect(()=>{
       sharedChatManager.setIsEndListener((isEnd) => {
          setEndGame(isEnd);
       });

    })



    useEffect(() => {
      const newplayer:Player = {
        ...player,
        id:getPlayerIdByName(map,username),
        

    }
    console.log("historique", newplayer);
      sharedChatManager.sendPlayer(newplayer);

      sharedChatManager.setPlayersInfoListener((p) => {
      setListPlayer(p);
      });
    }
    , [player]);



    const timeUp = () => {
      sharedChatManager.sendFinishGame();
    }

    const [startTime] = useState<number>(() => Date.now());
    useEffect(() => {
      if(isEnd){

        const newplayer:Player = {
            ...player,
            id:getPlayerIdByName(map,username),
            
  
        }
        console.log("playsssssssssssssssssssssssssser", newplayer);
          sharedChatManager.sendPlayer(newplayer);

          sharedChatManager.setPlayersInfoListener((p) => {
          setListPlayer(p);
          });
         
    }}, [isEnd]);
    useEffect(() => {
      console.log("listPlayer", listPlayer);
      if(isEnd){
        setTimeout(() => {
          console.log("listPlayesr", listPlayer);
        navigate('/endgame',{state:{listPlayer,player,players}});
        }
        , 2000);
      }
    
    }, [listPlayer]);


    /*------------- ARTIFACTS --------------*/

    interface popup {
      name: string;
      image: string;
      message: string;
      onclose: undefined;
    }


    const [popupDisplay, setPopupDisplay] = useState<popup|null>(null);


    function backArtifact() {

      setPopupDisplay({
        name: "Retour",
        image: back,
        message: "Vous venez d'activer le retour en arrière, vous venez de remonter dans le temps",
        onclose: undefined,
      });
      
      if (1 === 1) {
        updateHistoryAndMap(player.history.slice(-2)[0]);
      }
    }

    function eraser() {
      setPopupDisplay
      ({
          name: "Gomme",
          image: gomme,
          message: "Pas de chance, la Gomme viens d'être activté, vous avez perdu votre dernier article trouvé !",
          onclose: undefined,
        });
  
      if (1 == 1) {
        for (let i = player.history.length - 1; i >= 0; i--) {
          const articleTitle = player.history[i];
  
          if (player.articles.get(articleTitle)) {
            const updatedArticles = new Map(player.articles);
            updatedArticles.set(articleTitle, false);
            const newPlayer: Player = {
              ...player,
              articles: updatedArticles,
            };
      
            setPlayer(newPlayer);
            
            break;
          }
        }
      }
    }
  
    async function disorienter() {
      setPopupDisplay({
        name: "Désorienter",
        image: desorienter,
        message: "Le Désorienter vient de s'activer, vous allez être amené vers un article aléatoire, bonne chance !",
        onclose: undefined,
      });
  
      if (1 == 1) {
        const response = await fetch("https://fr.wikipedia.org/api/rest_v1/page/random/summary");
        const data = await response.json();
        updateHistoryAndMap(data.title);
      }
    }


    function dictator() {
      const articlesMap = new Map(player.articles);
  
      if (1 == 1) {
        if (!player.dictator) {
          const availableTitles = Array.from(player.articles.keys()).filter(
            (title) => !articlesMap.get(title)
          );
  
          if (availableTitles.length > 0) {
            const randomTitle = availableTitles[Math.floor(Math.random() * availableTitles.length)];
            player.dictator = randomTitle;
            console.log("dictator", player.dictator);
  
            const newPlayer = {
              ...player,
              dictator: randomTitle,
            };
  
            setPlayer(newPlayer);
          }
        }
      }
      setPopupDisplay({
        name: "Dictateur",
        image: dictateur,
        message: "Le Dictateur a parlé, vous devez vous rendre sur l'article : " + player.dictator + ", votre liste d'articles ne sera plus mise à jour tant que le dictateur ne sera pas satisfait !",
        onclose: undefined,
      });
    }
  
    function updateHistory(articleTitle: string) {
  
      const updatedHistory = player.history ? [...player.history, articleTitle] : [articleTitle];
      const newPlayer = {
        ...player,
        history: updatedHistory,
      };
      setPlayer(newPlayer);
    }


    function dictatorUpdate(currentTitle: string) {
      if (currentTitle == player.dictator) {
        updateHistoryAndMap(currentTitle);
      } else {
        updateHistory(currentTitle);
      }
    }

    const startSnail=()=>{
      const newPlayer: Player = {
        ...player,
        snail :Date.now()
      };
      setPlayer(newPlayer);
  
      setPopupDisplay({
        name: "Escargot",
        image: snail,
        message: "La malédiction de l'escargot vient de frapper ! Vous êtes aussi lent que lui et vous ne pouvez plus changer d'article pendant 1 minutes, prenez le temps de réfléchir.",
        onclose: undefined,
      });
    }
    
    const resetSnail=()=>{
      const newPlayer: Player = {
        ...player,
        snail :null
      };
     setPlayer(newPlayer);
    }

    useEffect(() => {
      sharedChatManager.setMineListener((mine) => {
        setMine(new Map(mine));
        
        console.log("mine", mine);
      });
    });

    function findChangedKey(
      oldMap: Map<number, string[][]>,
      newMap: Map<number, string[][]>
    ): number | null {
      const allKeys = new Set([...oldMap.keys(), ...newMap.keys()]);
    
      for (const key of allKeys) {
        const oldVal = oldMap.get(key);
        const newVal = newMap.get(key);
    
        // Compare JSON.stringify versions (simple et efficace pour tableaux)
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          return key;
        }
      }
    
      return null; // Aucun changement détecté
    }
  
    function mined(newMined : Map<number,string[][]>) {
      let target = null;
      for (let i = 5; i >= 1; i--) {
        const index = player.history.length - i;
        if (index >= 0) {
          target = player.history[index];
          break;
        }
      }
      
      if (target) {
        const newPlayer: Player = {
          ...player,
          history: [...player.history, target]
        }
        setPlayer(newPlayer);

        console.log("essaie",newMined.get(getPlayerIdByName(map, username)) ?? [])
        console.log("newMined", newMined);
        const changedKey = findChangedKey(mine, newMined);
        sharedChatManager.sendMine(changedKey?? -1, newMined.get(changedKey??-1) ?? []);
    
        // props.onChange({
        //   ...props.game,
        //   mined: newMined,
        //   players: [
        //     {...props.game.players[props.game.currentPlayer],
        //       history: [...props.game.players[props.game.currentPlayer].history,target],
        //     },
        //   ],
        // });

      }
  
      setPopupDisplay({
        name: "Mine",
        image: mineImg,
        message: "Igo, le terrain est miné, pour de vrai, pour de vrai, le terrain est miné\n" +
            "Faut tailler, nous, on est loin d'l'époque où fallait détailler\n" +
            "Maintenant, il m'faut des factures détaillées, hum\n" +
            "Ça sentait toujours la caille, les taudis, les RS, les RS, les Cayenne\n" +
            "Les petits, ils oublient d'respecter les doyens, les doyens, ils oublient d'respecter les petits",
        onclose: undefined,
      });
    }

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
        console.error("Erreur:", error);
        return [];
      }
    };
    async function placemine() {
  
      const previousMined = mine;
      const newMined = new Map(previousMined);
      const currentList = newMined.get(getPlayerIdByName(map,username)) || [];
  
      const lastHistory = player.history[player.history.length - 1];
  
      try {
        const articleLinks = await extractArticleLinks(lastHistory);
  
        console.log("articleLinks", articleLinks);
  
        sharedChatManager.sendMine(getPlayerIdByName(map, username), [...currentList, [lastHistory, ...articleLinks]]);
  
      } catch (error) {
        console.error("Erreur lors de la récupération des liens d'articles :", error);
      }
    }

    console.log("miiine", mine);

    
    return (
        <>
        <FinChatter chatManager={sharedChatManager} initialUserName={username} avatar={avatar} />
    <section className='main-page game'>
        <figure className='logo-solo'>
          <svg width="30vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 400">
            <polygon points="40,10 130,1 70,160 100,160 5,390 35,200 0,200" stroke="#000000" stroke-width="7px" fill="#FDB813"/>
          </svg>
        </figure>


        <div className='game-container'>
          <div className='game-info'>
          <Timer
                deadlineMillis={duration !== undefined ? (startTime !== undefined ? startTime + duration * 60000 : undefined) : undefined}
                onTimeUp={timeUp}
            />
            </div>
          <div className='game-main'>
          <ArticleDisplayer title={player.history.slice(-1)[0]} updateHistoryAndMap={player.dictator !== null ? dictatorUpdate :updateHistoryAndMap} snail={player.snail} resetSnail={resetSnail} mined={mine} currentPlayer={getPlayerIdByName(map,username)}triggerMined={mined}/>
                       
          <div className='game-main-details'>
              <ArticleList names={player.articles } dictatorWord={player.dictator} />
               <PlayerInfo players={listPlayer} articles={player.articles} /> 
              </div>
          </div>

          <div className='game-bottom'>
            <svg width="104" height="93" viewBox="0 0 104 93" fill="none" xmlns="http://www.w3.org/2000/svg" id='svg-chat'>
              <ellipse cx="-48.6909" cy="171.86" rx="90.3383" ry="210" transform="rotate(40.0672 -48.6909 171.86)" fill="#4943C6"/>
            </svg>
          <div className="bottom_bar">
            <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bl'>
              <path d="M0 0H114C54.5 26 66 72 66 72H0V0Z" fill=" #4943C6" />
            </svg>
            <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='br'>
                <path d="M114 0H0C59.5 26 48 72 48 72H114V0Z" fill=" #4943C6"/>
              </svg>
          </div>
            <svg width="225" height="100" viewBox="0 0 225 73" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bb'>
              <path d="M111.675 -0.000378409C165.925 0.28796 237 19.4997 222 71.4994C206.999 123.499 165.925 114.16 111.674 113.872C57.4239 113.584 22.5001 123 2.99974 71.4993C-12 19 57.4247 -0.288717 111.675 -0.000378409Z" fill=" #4943C6"/>
            </svg>

            <Inventory
              artifact1={{ name: 'Eraser', description: '', img: mineImg, onActivate: placemine }}
              artifact2={{ name: 'Retour en arrière', description: '', img: back, onActivate:backArtifact }}
              isExist={artefacts}
            />
          </div>
        </div>
      </section>

            {/* Affichage des données récupérées */}
      <div className="data-display">
        <h2>Données récupérées :</h2>
        <p><strong>Nombre d'articles :</strong> {nombreArticles}</p>
        <p><strong>Artefacts :</strong> {artefacts}</p>
        <p><strong>Temps :</strong> {temps}</p>
        <p><strong>Mots aléatoires :</strong> {randomMots}</p>
        <p><strong>Choix de mots :</strong> {wordsList.join(', ')}</p> {/* Affichage de la liste des mots */}
      </div>
      <Background />
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
        </>
  )
}
}
export default MultiGame