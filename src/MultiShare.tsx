import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import { FaShare } from "react-icons/fa";
import { Background } from "./assets/back.tsx";
import images from './assets/monster/images'
import { DeletePLayer } from './component/Component'
import { PlayGame } from "./component/GameComponent.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatBox, FinChatter, RealChatter } from "./component/Chat.tsx";
import Damien from "./assets/avatar/Avatar_damien.svg";
import { sharedChatManager } from './chatManager';

function MultiShare() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.userName || "User";
  const [players, setPlayers] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  // États pour stocker les valeurs du formulaire
  const [nombreArticles, setNombreArticles] = useState<string>("");
  const [artefacts, setArtefacts] = useState<string>("");
  const [temps, setTemps] = useState<string>("");
  const [randomMots, setRandomMots2] = useState<string>("");
  const [choixMots, setChoixMots] = useState<string>("");
  const [wordsList, setWordsList] = useState<string[]>([]); // Liste des mots ajoutés

  let owner = players[0];
  console.log("Owner:", owner);
  console.log("Username:", username);


  useEffect(() => {
    // Configuration du listener pour la liste des joueurs
    sharedChatManager.setPlayersListener((newPlayers) => {
      console.log("🔄 Nouvelle liste des joueurs reçue :", newPlayers);
      setPlayers(newPlayers);
    });

    // Écouter les événements de création de room
    const handleRoomCreated = (newRoomId: string) => {
      console.log("Room ID reçu:", newRoomId);
      setRoomId(newRoomId);
    };

    sharedChatManager.setRoomCreatedListener(handleRoomCreated);

    // Ne pas fermer le WebSocket lors du démontage du composant
    return () => {
      // Ne rien faire ici
    };
  }, []);

  const handlePlayerRemove = (playerToRemove: string) => {
    // Pour l'instant, on ne fait que logger car la suppression devrait être gérée par le serveur
    console.log("Tentative de suppression du joueur:", playerToRemove);
  };

  // Gestionnaire pour naviguer vers PageB avec les données
  const handlePlayGame = (event: React.FormEvent) => {
    event.preventDefault();  // Empêcher la soumission du formulaire

    const formData = {
      nombreArticles,
      artefacts,
      temps,
      randomMots,
      choixMots,
      wordsList
    };
    navigate("/multigame", { state: formData });
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

  const setRandomMots = (value: string) => {
    setRandomMots2(value);
    if (value === "OUI") {
      document.getElementById("impossibleUse")!.style.display = "none";
      document.getElementById("morewords")!.style.display = "none";  
      document.getElementById("word")!.style.display = "none";
    }
    else {
      document.getElementById("impossibleUse")!.style.display = "block";
      document.getElementById("morewords")!.style.display = "flex";
      document.getElementById("word")!.style.display = "block";
    }
  };  

  const handleShare = async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId);
        alert("Code de la partie copié dans le presse-papier !");
      } catch (err) {
        console.error("Erreur lors de la copie :", err);
        alert("Erreur lors de la copie du code");
      }
    } else {
      alert("Aucun code de partie disponible");
    }
  };

  return (
   <div >
      <FinChatter chatManager={sharedChatManager} initialUserName={username} />

    <div className="page">
        <LogoTitle />
        <Background />
        <CreditButton />

      <div className="big">
          <form > {/* Utiliser onSubmit pour gérer la soumission */}
            <div className="container container-phone">
              <div id="monster_16">
                <img className="monsters" id="m16" src={images.cornu} alt="" />
              </div>

              <div id="monster_17">
                <img className="monsters" id="m17" src={images.titouan} alt="" />
              </div>


              <div className="left">
                <span className="title">Parametre</span>

                <table className="container_ul left-phone">
                  <tr>
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

                  <tr>
                    <td>
                      <span className="artefacts opt span-phone">Artefacts</span>
                    </td>
                    <td className="td-phone">
                      <Button
                        choix="artefacts"
                        value="OUI"
                        onClick={() => setArtefacts("OUI")}
                      />
                      <Button
                        choix="artefacts"
                        value="NON"
                        onClick={() => setArtefacts("NON")}
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
                        onClick={() => setRandomMots("OUI")}
                        
                      />
                      <Button
                        choix="random"
                        value="NON"
                        onClick={() => setRandomMots("NON")}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="word opt span-phone" id="impossibleUse">Choisir des mots</span>
                    </td>
                    <td>
                      <input
                        className="words input-phone"
                        type="text" 
                        placeholder="Choisir un mot"
                        value={choixMots}
                        onChange={(e) => setChoixMots(e.target.value)}
                        onKeyDown={handleKeyDown} 
                        id="word"
                      />
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
          <div className="title">Joueurs ({players.length})</div>
          <div className="container_ul">
            <ul>
              {players.map((player, index) => (
                <li key={index}>
                  {player} <DeletePLayer player={player} onClick={() => handlePlayerRemove(player)}/>
                </li>
              ))}
              
            </ul>
          </div>
        </div>

      </div>


        <div className="container_button">
          <div className="button" onClick={handleShare}>Partager<FaShare/></div>
      
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
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
                <li>Kabuto  <DeletePLayer player="Kabuto"/></li>
            </ul>
          </div>
        </div>
        </div>

    </div>
    </div>
  );
}

export default MultiShare;
