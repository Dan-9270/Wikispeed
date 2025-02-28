import "./style/App.css";
import { Button } from "./component/Component.tsx";
import { List } from "./component/Component.tsx";
import {ChatBox} from "./component/Chat.tsx";
import Damien from "./assets/avatar/Avatar_damien.svg";


function MultiShare() {
  return (
    
    <div className="big">
      <div className="container">
        <div className="left">
          <span className="title">Parametre</span>
            <ChatBox messages={[{player:{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},text:"Salut"},{player:{id:2,name:"lksjdklqjsdkq",time:200,avatar:Damien,score:20},text:"nnn"},{player:{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},text:"Salut"}]} player={{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20}}/>
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
        <div className="right">
          <div className="title">Joueurs</div>
          <div className="container_ul">
            <ul>
                <li>Kabuto </li>
                <li>Kabuto</li>
                <li>Kabuto</li>
                <li>Kabuto</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container_button">
        <button className="button">Partager</button>
        <button className="button">Demarrer</button>
      </div>
    </div>
  );
}

export default MultiShare;
