import Damien from "./assets/avatar/Avatar_damien.svg";
import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
import {ChatBox} from "./component/Chat.tsx";


import { ArticleList, Inventory, PlayerInfo, Timer } from './component/EventComponent'



import './style/wikispeed.css'
import './style/timer.css'
import './style/game.css'
import { ArticleDisplayer } from './component/Article'
import { Background } from "./assets/back.tsx";

function MultiGame() {
const articles=["Nazisme","Togo","Homosexualité","Dialga Gold","Barcola"];
  return (
        <>
        <Background></Background>
            <ChatBox messages={[{player:{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},text:"Salut"},{player:{id:2,name:"lksjdklqjsdkq",time:200,avatar:Damien,score:20},text:"nnn"},{player:{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},text:"Salut"}]} player={{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20}}/>
            <section className='main-page game'>
          <figure className='logo-solo'>
          <svg width="30vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 400">
  <polygon points="40,10 130,1 70,160 100,160 5,390 35,200 0,200" stroke="#000000" stroke-width="7px" fill="#FDB813"/>
</svg>
            </figure>
        <div className='game-container'>
          <div className='game-info'>
            <Timer />
            <ArticleList names={articles} />
          </div>
          <div className='game-main'>
              <ArticleDisplayer title='France'/>
              <PlayerInfo players={[{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},{id:2,name:"Bibabo",time:200,avatar:Damien,score:20}]} articles={articles} />
          </div>

            <div className='game-bottom'>
                <svg xmlns="http://www.w3.org/2000/svg" width="145" height="118" viewBox="0 0 145 118" fill="none">
                    <path d="M12.5852 5.82508L144.459 0.37847L113.764 25.7168L105.137 52.8468L102.059 117.977L-2.41697e-05 105.03L12.5852 5.82508Z" fill="#4943C6"/>
                </svg>
                <Inventory artifact1={{name:'mine',description:'',img:mine}} artifact2={{name:'map',description:'',img:map}} />
                <svg xmlns="http://www.w3.org/2000/svg" width="111" height="79" viewBox="0 0 111 79" fill="none">
                    <path d="M131.878 5.82496L-0.000232127 0.384232L30.6971 25.7212L39.3253 52.8509L42.4052 117.981L144.467 105.029L131.878 5.82496Z" fill="#4943C6"/>
                </svg>
            </div>
        </div>
        </section>
        </>
  )
}

export default MultiGame
