import Damien from "./assets/avatar/Avatar_damien.svg";
import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
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


    const [player,setPlayer] = useState<Player>({
      id:0,
      name:username,
      time:200,
      avatar:avatar,
      score:20,
      history:[randomTitle],
      articles:articlesMap.set(randomTitle, true) 
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
              <Timer time={temps} onTimeUp={setIsOver} />
            </div>
          <div className='game-main'>
          <ArticleDisplayer title={player.history.slice(-1)[0]} updateHistoryAndMap={updateHistoryAndMap} hasSnailArtifact={hasSnailArtifact} />
                       
          <div className='game-main-details'>
              <ArticleList names={player.articles } />
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

            <Inventory artifact1={{ name: 'mine', description: '', img: mine }} artifact2={{ name: 'map', description: '', img: map }} isExist={artefacts} />
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
        </>
  )
}
}
export default MultiGame
