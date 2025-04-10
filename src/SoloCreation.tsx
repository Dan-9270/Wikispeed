import { useState } from "react";
import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import { CreditButton } from "./component/Component";
import { Background } from "./assets/back.tsx";
import images from "./assets/monster/images";
import { LogoTitle } from "./component/Component";
import { AutoCompleteInput, PlayGame } from "./component/GameComponent.tsx";
import { useLocation } from 'react-router-dom';
import { Game } from "./Game.tsx";
import { MusicPlayer } from './component/MusicComponent'


function SoloCreation(props:{game : Game; onChange:(newGame:Game)=> void; onChangeGameState:(state:string)=> void }) {
  const location = useLocation();
  const username = location.state.username;
  const avatar = location.state.avatar;
  const player = {id: 1, name: username, avatar: avatar, history: [], time: 0, score: 0, articles:new Map(),dictator:null,snail:null, inventory:[], currentArtefact:0};

  const [nombreArticles, setNombreArticles] = useState<number>(0);
  const [artefacts, setArtefacts] = useState<boolean>(false);
  const [temps, setTemps] = useState<number>(0);
  const [randomMots, setRandomMots2] = useState<boolean>(false);
  const [choixMots, setChoixMots] = useState<string>("");
  const [wordsList, setWordsList] = useState<string[]>([]);

  const handlePlayGame = (event: React.FormEvent) => {
    event.preventDefault();
    const settings ={
        nombreArticles: nombreArticles,
        artefacts: artefacts,
        temps: temps === -1 ? undefined : temps,
        randomMots: randomMots,
        choixMots: choixMots,
        wordsList: wordsList,
    }
    
    const newGame = {
      ...props.game,
      players:[player],
      currentPlayer:0,
      settings: settings,
      end: false,
      startTime: undefined,
      endTime: undefined,
      mined:new Map<number, string[][]>([[0, []]]),
    }
    props.onChange(newGame)
    props.onChangeGameState("loading")
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && choixMots.trim() !== "") {
      event.preventDefault();
  
      const mot = choixMots.trim().toLowerCase(); // Pour éviter les doublons avec des majuscules/minuscules
      const isDuplicate = wordsList.some((w) => w.toLowerCase() === mot);
  
      if (isDuplicate) {
        alert("Ce mot a déjà été ajouté.");
        return;
      }
  
      if (wordsList.length >= Number(nombreArticles)) {
        alert("Vous ne pouvez pas ajouter plus de mots.");
        return;
      }
  
      setWordsList((prevWords) => [...prevWords, choixMots]);
      setChoixMots("");
    }
  };


  const handleRemoveWord = (wordToRemove: string) => {
    setWordsList((prevWords) => prevWords.filter((word) => word !== wordToRemove));
  };




  const setRandomMots = (value: boolean) => {
    setRandomMots2(value);
    if (value) {
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
    
  return (
    <div>
      <div className="page">
        <LogoTitle />
        <Background />
        <CreditButton />
        <MusicPlayer/>

        <div className="big">
          <form onSubmit={handlePlayGame}> {/* Utiliser onSubmit pour gérer la soumission */}
            <div className="container container-phone solo">
              <div id="monster_16">
                <img className="monsters" id="m16" src={images.cornu} alt="" />
              </div>

              <div id="monster_17">
                <img className="monsters" id="m17" src={images.titouan} alt="" />
              </div>

              <div className="left">
                <span className="title">Parametre</span>

                <table className="container_ul left-phone">
                  <tbody>
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
                        value= "OUI"
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
                  </tbody>
                </table>
                <div className="morewords">
                  <ul id="morewords">
                    {wordsList.map((word, index) => (
                      <li key={index} onClick={()=>handleRemoveWord(word)}>{word}</li>  
                    ))}
                  </ul>
                </div>
              </div>
            </div>



            <div className="container_button">
              <PlayGame link="sologame" owner={username} username={username} onClick={handlePlayGame} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SoloCreation;
