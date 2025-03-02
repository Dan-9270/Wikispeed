import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import { FaShare } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark} from "@fortawesome/free-solid-svg-icons";
import { Background } from "./assets/back.tsx";
import images from './assets/monster/images'
import { DeletePLayer } from './component/Component'





function MultiShare() {
  return (
   <div >
    <div className="page">
       <LogoTitle />
      <Background></Background>
       <CreditButton />
         <div className="big">
    <form action="">
      <div className="container container-phone">

          <div id="monster_16">
            <img className='monsters' id='m16' src={images.cornu} alt="" />
          </div>

          <div id="monster_17">
            <img className='monsters' id='m17' src={images.titouan} alt="" />
          </div>

        <div className="left">
          <span className="title">Parametre</span>
       
         
          <table className="container_ul left-phone">
            
            <tr>
              <td> <span className="nbreArticle opt span-phone">Nombre d'articles</span></td>
              <td className="td-phone"> <List children="article" /></td>
            </tr>

            <tr> 
            <td> <span className="artefacts opt span-phone">Artefacts</span></td> 
            <td className="td-phone"> <Button choix="artefacts" value="OUI" /> <Button choix="artefacts" value="NON"/></td>
            </tr>
            <tr> 
            <td>     <span className="temps opt span-phone ">Temps</span></td> 
            <td className="td-phone">    <List children="time"/></td>
            </tr>
            <tr> 
            <td>   <span className="random opt span-phone">Mots aleatoires</span></td> 
            <td className="td-phone">  <Button choix="random" value="OUI" /> <Button choix="random" value="NON"/>   </td>
            </tr>
            <tr> 
            <td>  <span className="word opt span-phone">Choisir ses mots</span></td> 
            <td>  <form action="">
                  <input className="words input-phone" type="text" placeholder="Choisir un mot" />
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
      <div className="container_button">
        <button className="button">Partager<FaShare/></button>
        <button className="button">Demarrer<FaPlay/> </button>
      </div>
      </form>
    </div>
    </div><div className="page2">
    <div className="container container-phone">
    <div className="right">
          <div className="title">Joueurs</div>
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
