import "./style/App.css";
import { Button, Impossible } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import { FaShare } from "react-icons/fa";
import { Background } from "./assets/back.tsx";
import images from './assets/monster/images'
import { DeletePLayer } from './component/Component'
import { AutoCompleteInput, PlayGame } from "./component/GameComponent.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { ChatBox, FinChatter, RealChatter } from "./component/Chat.tsx";
import Damien from "./assets/avatar/Avatar_damien.svg";
import { sharedChatManager } from './chatManager';
import { MusicPlayer } from './component/MusicComponent'


function MultiShare() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.userName || "User";
  const avatar = location.state?.avatar;
  const listPlayer = location.state?.players || [];
  const [players, setPlayers] = useState<string[]>(listPlayer);
  const [roomId, setRoomId] = useState<string | null>(null);

  // États pour stocker les valeurs du formulaire
  const [nombreArticles, setNombreArticles] = useState<number>(0);
  const [artefacts, setArtefacts] = useState<boolean>(false);
  const [temps, setTemps] = useState<number>(0);
  const [randomMots, setRandomMots2] = useState<boolean>(false);
  const [choixMots, setChoixMots] = useState<string>("");
  const [wordsList, setWordsList] = useState<string[]>([]); // Liste des mots ajoutés
  const [copied, setCopied] = useState(false);
  const [isGame, setIsGame] = useState(false);
  const [parameters, setParameters] = useState<Object>({});

  const [playerMap, setPlayersMap] = useState<Map<number, string>>(new Map());
  let owner = players[0];
  console.log("jesuis une liste de joueurs",players);
  console.log("Owner:", owner);
  console.log("Username:", username);
  console.log("Avatar:", avatar);


  console.log("isGame:", isGame);


  const fillPlayersMap = (playersList: string[]): Map<number, string> => {
    const playersMap = new Map<number, string>();
    
    playersList.forEach((player, index) => {
      playersMap.set(index, player);
    });
  
    return playersMap;
  };

  useEffect(() => {
    sharedChatManager.setPlayersListener((players) => {
      setPlayers(players);
    });
    sharedChatManager.setIsGameListener((isGame) => {
      setIsGame(isGame);
    });
    sharedChatManager.setParametersListener((parameters) => {
      setParameters(parameters);
      console.log("ezezzezezeez:", parameters);
      const userName = username;
    const img = avatar;
      console.log("playersMap:", playerMap);  
      navigate("/multigame", { state: {parameters, userName, img,playerMap,players} });
    });
  }, [playerMap]);

  useEffect(() => {
    if (copied) {
      console.log("Room ID copied to clipboard:", roomId);
    }
  }
  , [isGame]);

  useEffect(() => {
    if (isGame) {
      setPlayersMap(fillPlayersMap(players));

      handleGameStart();
    }
  }, [isGame]);




  const putBlackSettings = () => {
    document.getElementById("impossibleUse")!.style.display = "none";}
   

  const handlePlayerRemove = (playerToRemove: string) => {
    // Pour l'instant, on ne fait que logger car la suppression devrait être gérée par le serveur
    console.log("Tentative de suppression du joueur:", playerToRemove);
  };

  // Gestionnaire pour naviguer vers PageB avec les données
  const handlePlayGame = (event: React.FormEvent) => {
    event.preventDefault();  // Empêcher la soumission du formulaire
    sharedChatManager.sendGameStart();
   
  };

  
  const handleGameStart = async () => {
    const formData = {
      nombreArticles,
      artefacts,
      temps,
      randomMots,
      choixMots,
      wordsList,// Initialisé vide
    };

    const fetchRandomArticles = async () => {
      const articles = [];
  
      for (let i = 0; i < formData.nombreArticles; i++) {
        try {
          const response = await fetch("https://fr.wikipedia.org/api/rest_v1/page/random/summary");
          const data = await response.json();
          if (data?.title) articles.push(data.title);
        } catch (error) {
          console.error("Erreur lors de la récupération d'un article Wikipedia:", error);
          articles.push(`Article ${i + 1}`);
        }
      }
  
      console.log("articles:", articles); // ✅ Ce log fonctionnera maintenant
      return articles;
    };
    if(randomMots === true){
    formData.wordsList = await fetchRandomArticles(); // ✅ Attendre la fin de la récupération des articles
    }else{
      await fetchRandomArticles();
    }
    console.log("formData:", formData); // ✅ Maintenant, wordsList contient les bons articles
    sharedChatManager.sendParameters(formData);
  };
  

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && choixMots.trim() !== "") {
      if (wordsList.length >= Number(nombreArticles)) {
        alert("Vous ne pouvez pas ajouter plus de mots.");
        event.preventDefault()
      } 
      else {
      event.preventDefault(); 
  
      setWordsList((prevWords) => [...prevWords, choixMots]);
      
    
      setChoixMots("");
    }
  }
  };

  const handleRemoveWord = (wordToRemove: string) => {
    setWordsList((prevWords) => prevWords.filter((word) => word !== wordToRemove));
  };

  const setRandomMots = (value: boolean) => {
    setRandomMots2(value);
    if (value === true) {
      document.getElementById("impossibleUse")!.style.display = "none";
      document.getElementById("morewords")!.style.display = "none";  
      document.getElementById("word")!.style.display = "none";
      setChoixMots("");
      setWordsList([]);
    }
    else {
      document.getElementById("impossibleUse")!.style.display = "block";
      document.getElementById("morewords")!.style.display = "flex";
      document.getElementById("word")!.style.display = "block";
    }
  };  



  const handleCopy = () => {
    const roomId = sharedChatManager.getRoomId()
    navigator.clipboard.writeText(roomId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset après 2 secondes
      })
      .catch(err => console.error("Erreur de copie:", err));
  };

  return (    
   <div >
    <FinChatter chatManager={sharedChatManager} initialUserName={username} avatar={avatar} />

    <div className="page">
        <LogoTitle />
        <Background />
        <CreditButton />
        <MusicPlayer />


      <div className="big">
          <form > {/* Utiliser onSubmit pour gérer la soumission */}
            <div className="container container-phone">
              <div id="monster_16">
                <img className="monsters" id="m16" src={images.cornu} alt="" />
              </div>

              <div id="monster_17">
                <img className="monsters" id="m17" src={images.titouan} alt="" />
              </div>


              <div className="left" >
                <Impossible username={username} owner={owner}/>
                <span className="title">Parametre</span >

                <table className="container_ul left-phone">
                  <tr id={username !== owner ? "gris" : "" }>
                    <td>
                      <span className="nbreArticle opt span-phone">Nombre d'articles</span>
                    </td>
                    <td className="td-phone">
                      <List
                        children="article"
                        onChange={(value) => setNombreArticles(value)}
                      />
                    </td>
                  </tr>

                  <tr id={username !== owner ? "gris" : "" }>
                    <td>
                      <span className="artefacts opt span-phone">Artefacts</span>
                    </td>
                    <td className="td-phone">
                      <Button
                        choix="artefacts"
                        value="OUI"
                        onClick={() => setArtefacts(true)}
                      />
                      <Button
                        choix="artefacts"
                        value="NON"
                        onClick={() => setArtefacts(false)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="temps opt span-phone">Temps</span>
                    </td>
                    <td className="td-phone">
                      <List
                        children="time"
                        onChange={(value) => setTemps(value)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="random opt span-phone">Mots aleatoires</span>
                    </td>
                    <td className="td-phone">
                      <Button
                        choix="random"
                        value="OUI"
                        onClick={() => setRandomMots(true)}
                        
                      />
                      <Button
                        choix="random"
                        value="NON"
                        onClick={() => setRandomMots(false)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="word opt span-phone" id="impossibleUse">Choisir des mots</span>
                    </td>
                    <td>
                       <AutoCompleteInput value={choixMots} onChange={setChoixMots} onKeyDown={handleKeyDown}></AutoCompleteInput>
                    </td>
                  </tr>
                </table>

                <div className="morewords">
                  <ul id="morewords">
                    {wordsList.map((word, index) => (
                      <li key={index} onClick={()=>handleRemoveWord(word)}>{word}</li>  
                    ))}
                  </ul>
                </div>
              </div>


              <div className="right">
          <div className="title">Joueurs    
          </div>
          <div className="container_ul">
            <ul>
              {players.map((player, index) => (
                <li key={index}>
                  {player} <DeletePLayer player={player}/>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>


        <div className="container_button">
          <div onClick={handleCopy} className="button">Partager<FaShare/></div>
          <PlayGame link="multigame" onClick={handlePlayGame} username={username} owner={owner}/>
            </div>
          </form>
        </div>
      </div>
    
    <div className="page2">
    <div className="container container-phone">
    <div className="right">
          <div className="title">Joueurs ({players.length})</div>
          <div className="container_ul">
            <ul>
            {players.map((player, index) => (
                <li key={index}>
                  {player} <DeletePLayer player={player}/>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

    </div>
    </div>
  );
}

export default MultiShare;
