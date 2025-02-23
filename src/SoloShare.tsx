import "./App.css";
import { Button } from "./components.tsx";
import { List } from "./components.tsx";

function SoloShare() {

return(

    <div className="big">
      <div className="container solo">
      <div className="left">
          <span className="title">Parametre</span>
          <table className="container_ul">

            <tr>
              <td>     <span className="nbreArticle opt">Nombre d'articles</span></td>
              <td> <List children="article" /></td>
            </tr>

            <tr> 
            <td> <span className="artefacts opt">Artefacts</span></td> 
            <td> <Button children="OUI" /> <Button children="NON" /></td>
            </tr>
            <tr> 
            <td>     <span className="temps opt ">Temps</span></td> 
            <td>   <List children="time" /></td>
            </tr>
            <tr> 
            <td>   <span className="random opt">Mots aleatoires</span></td> 
            <td>    <Button children="OUI" /> <Button children="NON" /></td>
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
       
        <button className="button">Demarrer</button>
      </div>
    </div>
)
}
export default SoloShare;