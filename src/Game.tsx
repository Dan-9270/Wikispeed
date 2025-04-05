import SoloCreation from "./SoloCreation";
import SoloGame from "./SoloGame";
import EndGameSolo from "./EndGameSolo";
import {useState, useEffect} from "react";
import { Player } from "./types/Player";
import { Loading } from "./component/GameComponent";

interface Setting {
    nombreArticles: number;
    artefacts: boolean;
    temps: number|undefined;
    randomMots: boolean;
    choixMots: string;
    wordsList: string[];
  }

export interface Game {
    players: Player[];
    currentPlayer: number;
    settings: Setting;
    end: boolean;
    startTime: number | undefined;
    endTime : number | undefined;
}

export function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsedItem = JSON.parse(item);

                // Fonction pour parcourir un objet ou un tableau en profondeur et convertir les Maps sérialisées
                const deepConvertMapsToObjects = (value: any): any => {
                    if (value && value._isMap) {
                        return new Map(value.entries); // Reconstruire la Map à partir des entrées
                    }

                    if (Array.isArray(value)) {
                        return value.map(deepConvertMapsToObjects); // Parcours récursivement les tableaux
                    }

                    if (value !== null && typeof value === "object") {
                        const newObj: any = {};
                        for (const key in value) {
                            if (value.hasOwnProperty(key)) {
                                newObj[key] = deepConvertMapsToObjects(value[key]); // Parcours récursivement les objets
                            }
                        }
                        return newObj;
                    }

                    return value; // Si c'est une valeur primitive, on la retourne telle quelle
                };

                const convertedItem = deepConvertMapsToObjects(parsedItem);
                return convertedItem;
            }
            return initialValue;
        } catch (error) {
            console.error("Error reading localStorage key", key, error);
            return initialValue;
        }
    });

    useEffect(() => {

        try {
            const deepConvertMapsForSaving = (value: any): any => {
                if (value instanceof Map) {
                    return {
                        _isMap: true,
                        entries: Array.from(value.entries()),
                    };
                }

                if (Array.isArray(value)) {
                    return value.map(deepConvertMapsForSaving);
                }

                if (value !== null && typeof value === "object") {
                    const newObj: any = {};
                    for (const key in value) {
                        if (value.hasOwnProperty(key)) {
                            newObj[key] = deepConvertMapsForSaving(value[key]);
                        }
                    }
                    return newObj;
                }

                return value; // Si c'est une valeur primitive, on la retourne telle quelle
            };

            const valueToStore = deepConvertMapsForSaving(storedValue);

            window.localStorage.setItem(key, JSON.stringify(valueToStore));
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
        startTime:undefined,
        endTime:undefined

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
    else if (gameState === "game") {
        // INITIALISE L'HISTORIQUE DANS LE PLAYER
        if (game.players[0].history.length === 0) {
            const randomTitle = game.settings.wordsList[Math.floor(Math.random() * game.settings.wordsList.length)];

            // Met à jour l'historique et la Map des articles du joueur
            const updatedPlayer = {
                ...game.players[0],
                history: [randomTitle],
                articles: new Map(game.players[0].articles).set(randomTitle, true), // Marque l'article comme "true"
            };

            const updatedGame = {
                ...game,
                players: [updatedPlayer],
            };

            setGame(updatedGame);
        }

// INITIALISE LA MAP DANS LE PLAYER
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
        //INITIALISE LE TIMER
        if(game.startTime===undefined){
            const startTime = Date.now();
            const updatedGame = {
                ...game,
                startTime:startTime,
            };
            setGame(updatedGame);
        }
        // AFFICHE LA PARTIE
      return <><SoloGame game={game} onChange={setGame} onChangeGameState={setGameState}/>
      </>
    }
    else {
        //INITIALISE LE TIMER
        if(game.endTime===undefined){
            const endTime = Date.now();
            const updatedGame = {
                ...game,
                endTime:endTime,
            };
            setGame(updatedGame);
        }
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