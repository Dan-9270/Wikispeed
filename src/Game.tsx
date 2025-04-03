import SoloCreation from "./SoloCreation";
import SoloGame from "./SoloGame";
import EndGameSolo from "./EndGameSolo";
import {useState, useEffect, useMemo} from "react";
import { Player } from "./types/Player";
import { Loading } from "./component/GameComponent";

interface Setting {
    nombreArticles: number;
    artefacts: boolean;
    temps: number;
    randomMots: boolean;
    choixMots: string;
    wordsList: string[];
  }
 
export interface Game {
    players: Player[];
    currentPlayer: number;
    settings: Setting;
    end: boolean;
}

export function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage key", key, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error("Error saving to localStorage key", key, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}



export const Game = () => {


    const [gameState, setGameState] = useLocalStorage("gameState", "build");
    const setting = {
        nombreArticles: 0,
        artefacts: false,
        temps: 0,
        randomMots: false,
        choixMots: "",
        wordsList: [],
    }

    const [game, setGame] = useLocalStorage("game", {
        players:[],
        currentPlayer: 0,
        settings: setting,
        end: false,
    });
    const updateHistory = (articleTitle: string) => {
        setGame((prevGame: Game) => ({
            ...prevGame,
            players: prevGame.players.map((player, index) =>
                index === 0 ? { ...player, history: [...player.history, articleTitle] } : player
            ),
        }));
    };


    if(gameState === "build"){
        return(
            <SoloCreation game={game} onChange={setGame} onChangeGameState={setGameState}/>
        )
    }
    else if(gameState === "loading"){
        return(
            <Loading  game={game} onChange={setGame} onChangeGameState={setGameState}/>
        )
    }
    else if (gameState === "game") {
      if (game.players.length > 0 && game.players[0].articles.size === 0) {
        const updatedGame = {
          ...game,
          players: [
            {
              ...game.players[0],
              articles: new Map(game.settings.wordsList.map((article: string) => [article, false])),
            },
          ],
        };
        setGame(updatedGame);
      }

        if (game.players[0].history.length === 0) {
            const randomTitle = game.settings.wordsList[Math.floor(Math.random() * game.settings.wordsList.length)];

            const updatedPlayer = {
                ...game.players[0],
                history: [randomTitle],
            };

            const updatedGame = {
                ...game,
                players: [updatedPlayer],
            };

            setGame(updatedGame);
        }


    
      return <><SoloGame game={game} onChange={setGame} onChangeGameState={setGameState} updateHistory={updateHistory}/>
          <button onClick={()=>updateHistory('paris')}>test</button>

      </>
    }
    else {
        return(
            <EndGameSolo game={game}  onChangeGameState={setGameState}/>
        )
    }
}

export const MultiGame = () => {


  const [gameState, setGameState] = useLocalStorage("gameState", "build");
  const setting = {
      nombreArticles: 0,
      artefacts: false,
      temps: 0,
      randomMots: false,
      choixMots: "",
      wordsList: [],
  }

  const [game, setGame] = useLocalStorage("game", {
      players:[],
      currentPlayer: 0,
      settings: setting,
      end: false,
  });

  if(gameState === "build"){
      return(
          <SoloCreation game={game} onChange={setGame} onChangeGameState={setGameState}/>
      )
  }
  else if(gameState === "loading"){
      return(
          <Loading  game={game} onChange={setGame} onChangeGameState={setGameState}/>
      )
  }
  else if(gameState === "game"){
    if(game.players[0].articles.size === 0){
      game.players[0] = {
        ...game.players[0],
        articles: new Map(game.settings.wordsList.map((article: string) => [article, false])),
      }
    }
      return(
          <SoloGame game={game} onChange={setGame} onChangeGameState={setGameState}/>
      )
  }
  else {
      return(
          <EndGameSolo game={game}  onChangeGameState={setGameState}/>
      )
  }
}