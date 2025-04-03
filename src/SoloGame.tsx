import mine from './assets/artifact/mine.svg';
import map from './assets/artifact/map.svg';
import benjamin from './assets/monster/benjamin.png';
import { ArticleList, Inventory, Timer } from './component/EventComponent';
import './style/wikispeed.css';
import './style/timer.css';
import './style/game.css';
import { ArticleDisplayer } from './component/Article';
import { Background } from "./assets/back.tsx";
import { useState, useEffect, useCallback, useMemo, use } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type {Player} from './types/Player.ts';
import { Game, useLocalStorage } from './Game.tsx';
export { useLocalStorage } from './Game.tsx';


function SoloGame(props:{game:Game;  onChange:(newGame:Game)=> void; onChangeGameState:(state:string)=> void}){

  const { nombreArticles, artefacts, temps, randomMots, wordsList } = props.game.settings;
  const soloPlayer = props.game.players[0]
  const [isOver, setIsOver] = useState(false);

  
  const updateHistory = (articleTitle: string) => {
    const newHistory = [...props.game.players[0].history, articleTitle];
    
    const newPlayer: Player = {
      ...props.game.players[0],
      history: newHistory, 
    };
  
    const newGame = {
      ...props.game,
      players: [newPlayer], 
    };
  
    props.onChange(newGame); 
  };

  const updateArticles = (articles: Map<string, boolean>) => {
    const updatedPlayer: Player = {
      ...soloPlayer,
      articles: articles
    };
    props.onChange({
      ...props.game,
      players: [updatedPlayer], 
    });
  }


  const [hasSnailArtifact, setHasSnailArtifact] = useState(false);

  const activateSnailArtifactRandomly = useCallback(() => {
    const randomValue = Math.random();
    return randomValue < 0.1;
  }, []);

  const articlesMap: Map<string, boolean> = useMemo(() => {
    return new Map(wordsList.map((article: string) => [article, false]));
  }, [wordsList]);

  const randomTitle = useMemo(() => {
    return wordsList.length > 0 ? wordsList[Math.floor(Math.random() * wordsList.length)] : "Aucun mot disponible";
  }, [wordsList]);

  // if(props.game.players[0].history.length == 0){
  //   console.log("Aucun mot trouvé dans l'historique, ajout d'un mot aléatoire."); 
  //   updateHistory(randomTitle);
  // }

  const updatedArticlesMap = props.game.players[0].articles;
  const articleTitle = props.game.players[0].history[props.game.players[0].history.length - 1];


  const navigate = useNavigate();

  useEffect(() => {
    if (props.game.players[0].history.length === 0 && wordsList.length > 0) {
      const initialTitle = randomMots ? randomTitle : wordsList[0];
      updateHistory(initialTitle);
    }
  }, [wordsList, randomMots, randomTitle]);

  
  const findTitleInHistory = useCallback(() => {
    for (let i = soloPlayer.history.length - 1; i >= 0; i--) {
      const historyTitle = soloPlayer.history[i];
      if (updatedArticlesMap.has(historyTitle) && updatedArticlesMap.get(historyTitle)) {
        return historyTitle;
      }
    }
    return null;
  }, [soloPlayer, updatedArticlesMap]);

  const useEraser = useCallback(() => {
    const title = findTitleInHistory();
    if (title != null) {
      const updatedMap = new Map(props.game.players[0].articles);
      if (updatedMap.has(title)) {
        updatedMap.set(title, false);
      }
      updateArticles(updatedMap); // Appelle directement avec la nouvelle Map
    }
  }, [findTitleInHistory]);


  const updateArticleStatus = useCallback((title: string) => {
  
    const updatedMap = new Map(props.game.players[0].articles);
    if (updatedMap.has(title)) {
      updatedMap.set(title, true);
    }
    updateArticles(updatedMap);


      // const updatePlayer: Player = {
      //   ...soloPlayer,
      //   articles: updatedMap
      // }
  
  
      // props.onChange({
      //   ...props.game,
      //   players: [updatePlayer], 
      // });
  }, []);

  const handleArticleChange = useCallback((newTitle: string) => {
    if (artefacts === true && activateSnailArtifactRandomly()) {
      setHasSnailArtifact(true);
    } else {
      setHasSnailArtifact(false);
    }
    if (newTitle && newTitle !== articleTitle) {
      updateHistory(newTitle);
    }
  }, [artefacts, activateSnailArtifactRandomly, articleTitle]);

  useEffect(() => {
    const allArticlesFound = Array.from(updatedArticlesMap.values()).every(status => status === true);
    console.log("c'est moi ddf",props.game);
    if (allArticlesFound || isOver) {
      props.onChangeGameState("end");
    }
  }, [updatedArticlesMap, navigate]);
  useEffect(() => {
  }, [soloPlayer]);

  
  useEffect(() => {

    if (isOver) {
      props.onChangeGameState("end");
    }
  })
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
            <Timer time={temps} onTimeUp={setIsOver} />
          </div>
          <div className='game-main'>
            <ArticleDisplayer
              title={articleTitle}
              setTitle={handleArticleChange}
              updateArticleStatus={updateArticleStatus}
              hasSnailArtifact={hasSnailArtifact}
            />
            <div className='game-main-details'>
              <ArticleList names={updatedArticlesMap} />
              <figure className="monster">
                <img src={benjamin} alt="benjamin" />
              </figure>
            </div>
          </div>
          <div className='game-bottom'>
            <div className="bottom_bar">
              <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bl'>
                <path d="M0 0H114C54.5 26 66 72 66 72H0V0Z" fill=" #4943C6" />
              </svg>
              <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='br'>
                <path d="M114 0H0C59.5 26 48 72 48 72H114V0Z" fill=" #4943C6" />
              </svg>
            </div>
            <svg width="225" height="100" viewBox="0 0 225 73" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bb'>
              <path d="M111.675 -0.000378409C165.925 0.28796 237 19.4997 222 71.4994C206.999 123.499 165.925 114.16 111.674 113.872C57.4239 113.584 22.5001 123 2.99974 71.4993C-12 19 57.4247 -0.288717 111.675 -0.000378409Z" fill=" #4943C6" />
            </svg>

            <Inventory
              artifact1={{ name: 'Eraser', description: '', img: mine,onActivate:useEraser }}
              artifact2={{ name: 'map', description: '', img: map }}
              isExist={artefacts}
            />
          </div>
        </div>
      </section>
      <button onClick={()=> updateHistory('paris')}>test</button>
      <Background />
    </>
  );
}

export default SoloGame;
