import back from './assets/back.svg'
import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
import { ArticleList, ChatRedirection, Inventory, PlayerInfo, Timer } from './component/EventComponent'



import './style/wikispeed.css'
import './style/timer.css'
import './style/game.css'
import { ArticleDisplayer } from './component/Article'

function SoloGame() {
const articles=["Nazisme","Togo","Homosexualité","Dialga Gold","Barcola"];
  return (
        <>
        <section className='main-page game'>
          <figure className='logo-solo'>
          <svg width="30vw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 400">
  <polygon points="40,10 130,1 70,160 100,160 5,390 35,200 0,200" stroke="#000000" stroke-width="7px" fill="#FDB813"/>
</svg>
            </figure>
        <div className='game-container'>
          <div className='game-up'>
            <Timer />
            <ArticleList names={articles} />
          </div>
          <div className='game-down'>
            <ArticleDisplayer title='Nazisme'content="deddezzeda" />
            <div className="game-info">
              <Inventory artifact1={{name:'mine',description:'',img:mine}} artifact2={{name:'map',description:'',img:map}} />
            </div>
          </div>
        </div>
        <figure className='background'><img src={back} alt="" /></figure> 
        </section>
        </>
  )
}

export default SoloGame
