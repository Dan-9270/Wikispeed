import {LogoTitle, Podium, Ranking} from './component/Component'
import {CreditButton} from './component/Component'
import {BottomRedirection} from './component/Component'

import Damien from './assets/avatar/Avatar_damien.svg'
import images from './assets/monster/images'



import './style/wikispeed.css'
import { Background } from './assets/back'
import { Player } from './types/Player'
import { sharedChatManager } from "./chatManager.ts";
import { useLocation } from 'react-router-dom'


function EndGame(){
    const location = useLocation();
    const listPlayer:Player[] = location.state.listPlayer;
    
   console.log("listPlayer:", listPlayer);
    return <>
    <Background/>
        <main>
            <section className="hero">

            <div id="monster_10">
              <img className='monsters' id='m10' src={images.titouan} alt="" />
            </div>

            <div id="monster_12">
              <img className='monsters' id='m12' src={images.degrado} alt="" />
            </div>

        <CreditButton/>
    <LogoTitle/>
        <Podium ranking={listPlayer}></Podium> 
    <BottomRedirection content="See the ranking" link="#bottom"/>
            </section>
         <Ranking ranking={listPlayer}/> 
        </main>
    </>
}
export default EndGame