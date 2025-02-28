import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import back from './assets/back.svg'
import { FaShare } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark} from "@fortawesome/free-solid-svg-icons";
import { Background } from "./assets/back.tsx";




function MultiShare() {
  return (
    <div className="page">
      <Background></Background>
       <CreditButton />
         <div className="big">
    <form action="">
      <div className="container">
        <div className="left">
          <span className="title">Parametre</span>
       
          <table className="container_ul">
            
            <tr>
              <td> <span className="nbreArticle opt">Nombre d'articles</span></td>
              <td> <List children="article" /></td>
            </tr>

            <tr> 
            <td> <span className="artefacts opt">Artefacts</span></td> 
            <td> <Button choix="artefacts" value="OUI" /> <Button choix="artefacts" value="NON"/></td>
            </tr>
            <tr> 
            <td>     <span className="temps opt ">Temps</span></td> 
            <td>   <List children="time" /></td>
            </tr>
            <tr> 
            <td>   <span className="random opt">Mots aleatoires</span></td> 
            <td>  <Button choix="random" value="OUI" /> <Button choix="random" value="NON"/>   </td>
            </tr>
            <tr> 
            <td>  <span className="word opt">Choisir ses mots</span></td> 
            <td>  <form action="">
                  <input className="words" type="text" placeholder="Choisir un mot" />
                  <input type="submit" />
                  </form></td>
            </tr>
     

          </table>
          <div className="morewords"><ul>
            <li>caca</li>
            <li>uyv</li>
            <li>starfallah</li>
            <li>incrr</li>
          </ul></div>
        </div>
        <div className="right">
          <div className="title">Joueurs</div>
          <div className="container_ul">
            <ul>
                <li>Kabuto <FontAwesomeIcon icon={faSquareXmark} /></li>
                <li>Kabuto <FontAwesomeIcon icon={faSquareXmark} /></li>
                <li>Kabuto <FontAwesomeIcon icon={faSquareXmark} /></li>
                <li>Kabuto <FontAwesomeIcon icon={faSquareXmark} /></li>
                <li>Kabuto <FontAwesomeIcon icon={faSquareXmark} /></li>
             
            </ul>
          </div>
        </div>
      </div>
      <div className="container_button">
        <button className="button">Partager<FaShare/></button>
        <button className="button">Demarrer<FaPlay/> </button>
      </div>
      </form>
    </div>
    </div>
  );
}

export default MultiShare;
