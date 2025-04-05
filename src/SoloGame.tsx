import benjamin from './assets/monster/benjamin.png';
import { ArticleList, Inventory, Timer } from './component/EventComponent';
import './style/wikispeed.css';
import './style/timer.css';
import './style/game.css';
import { ArticleDisplayer } from './component/Article';
import { Background } from "./assets/back.tsx";
import { useCallback,useState } from 'react';
import type { Player } from './types/Player.ts';
import { Game } from './Game.tsx';
import { createPortal } from 'react-dom';
import { ArtifactPopup } from './component/Artifact.tsx';
import gomme from './assets/artifact/gomme.svg';
import desorienter from './assets/artifact/compass.svg';
import dictateur from './assets/artifact/dictateur.svg';
import back from './assets/artifact/back.svg';
import mine from './assets/artifact/mine.svg';
import map from './assets/artifact/map.svg';
import snail from './assets/artifact/escargot.svg';
import { Interface } from 'readline';

function SoloGame(props: { game: Game; onChange: (newGame: Game) => void; onChangeGameState: (state: string) => void }) {
  const { nombreArticles, artefacts, temps, randomMots, choixMots, wordsList } = props.game.settings;
  const soloPlayer = props.game.players[0];
  console.log("game", soloPlayer.articles);

  const updateHistoryAndMap = (articleTitle: string) => {
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
    };
    props.onChange({
      ...props.game,
      players: [newPlayer],
    });
  };

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

  
  const activateSnailArtifactRandomly = useCallback(() => {
    const randomValue = Math.random();
    return randomValue < 0.1;
  }, []);

  // FONCTION ARTEFACTS  

  interface popup {
    name: string;
    image: string;
    message: string;
    onclose: undefined;
  }

  const [popupDisplay, setPopupDisplay] = useState<popup|null>(null);

  console.log("historique", soloPlayer.history);

  function backArtifact() {

    setPopupDisplay({
      name: "Retour",
      image: back,
      message: "Vous venez d'activer le retour en arrière, vous venez de remonter dans le temps",
      onclose: undefined,
    });
    
    if (1 === 1) {
      updateHistoryAndMap(props.game.players[props.game.currentPlayer].history.slice(-2)[0]);
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
              },
            ],
          });
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
    const articlesMap = new Map(props.game.players[props.game.currentPlayer].articles);

    if (1 == 1) {
      if (!props.game.players[props.game.currentPlayer].dictator) {
        const availableTitles = props.game.settings.wordsList.filter(
          (title) => !articlesMap.get(title)
        );

        if (availableTitles.length > 0) {
          const randomTitle = availableTitles[Math.floor(Math.random() * availableTitles.length)];
          props.game.players[props.game.currentPlayer].dictator = randomTitle;
          console.log("dictator", props.game.players[props.game.currentPlayer].dictator);

          const newPlayer = {
            ...props.game.players[props.game.currentPlayer],
            dictator: randomTitle,
          };

          props.onChange({
            ...props.game,
            players: [newPlayer],
          });
        }
      }
    }
    setPopupDisplay({
      name: "Dictateur",
      image: dictateur,
      message: "Le Dictateur a parlé, vous devez vous rendre sur l'article : " + props.game.players[props.game.currentPlayer].dictator + ", votre liste d'articles ne sera plus mise à jour tant que le dictateur ne sera pas satisfait !",
      onclose: undefined,
    });
  }

  function dictatorUpdate(currentTitle: string) {
    if (currentTitle == props.game.players[props.game.currentPlayer].dictator) {
      updateHistoryAndMap(currentTitle);
    } else {
      updateHistory(currentTitle);
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

            {/* <Timer time={temps} onTimeUp={}/> */}

          </div>
          <div className='game-main'>

            <ArticleDisplayer title={props.game.players[props.game.currentPlayer].history.slice(-1)[0]} updateHistoryAndMap={props.game.players[props.game.currentPlayer].dictator != null ? dictatorUpdate : updateHistoryAndMap} />

            <div className='game-main-details'>

              <ArticleList names={props.game.players[props.game.currentPlayer].articles} />

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
              artifact1={{ name: 'Eraser', description: '', img: mine, onActivate: eraser }}
              artifact2={{ name: 'Retour en arrière', description: '', img: back, onActivate:backArtifact }}
              isExist={artefacts}
            />

          </div>
        </div>
      </section>
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
  );
}


export default SoloGame;
