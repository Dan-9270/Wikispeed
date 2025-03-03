import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
import benjamin from './assets/monster/benjamin.png'

import { ArticleList, Inventory, Timer } from './component/EventComponent'


import './style/wikispeed.css'
import './style/timer.css'
import './style/game.css'
import { ArticleDisplayer } from './component/Article'
import {Background} from "./assets/back.tsx";

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
                <div className='game-info'>
                    <Timer />
                    
                 

                    
                </div>
                <div className='game-main'>
                    <ArticleDisplayer title='Nazisme'/>
                    <div className='game-main-details'>
                        <ArticleList names={articles} />
                        <figure className="monster">
                            <img src={benjamin} alt="benjamin" />
                        </figure>
                    </div>
                </div>

                <div className='game-bottom'>
       


                    <div className="bottom_bar">  <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bl'>
<path d="M0 0H114C54.5 26 66 72 66 72H0V0Z" fill=" #4943C6" />
</svg>


                <svg width="114" height="100" viewBox="0 0 114 72" fill="blue" xmlns="http://www.w3.org/2000/svg" id='br'>
<path d="M114 0H0C59.5 26 48 72 48 72H114V0Z" fill=" #4943C6"/>
</svg>

</div>
<svg width="225" height="100" viewBox="0 0 225 73" fill="blue" xmlns="http://www.w3.org/2000/svg" id='bb'>
<path d="M111.675 -0.000378409C165.925 0.28796 237 19.4997 222 71.4994C206.999 123.499 165.925 114.16 111.674 113.872C57.4239 113.584 22.5001 123 2.99974 71.4993C-12 19 57.4247 -0.288717 111.675 -0.000378409Z" fill=" #4943C6"/>
</svg>
<Inventory artifact1={{name:'mine',description:'',img:mine}} artifact2={{name:'map',description:'',img:map}} />
             

                </div>
                </div>
        </section>
            <Background></Background>
        </>
  )
}

export default SoloGame
