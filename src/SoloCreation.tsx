import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import {CreditButton} from './component/Component'
import { FaPlay } from "react-icons/fa";
import { Background } from "./assets/back.tsx";
import images from './assets/monster/images'



function SoloCreation() {

return(
  <div className="page">
     <CreditButton />
    <Background></Background>
    
   
    <div className="big">
     <form action="">
      <div className="container solo">

          <div id="monster_15">
            <img className='monsters ' id='m15' src={images.degrado} alt="" />
          </div>

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

      </div>
      <div className="container_button">
       
        <button className="button">Demarrer <FaPlay/></button>
      </div>
      </form>
    </div>
    </div>
)
}
export default SoloCreation;