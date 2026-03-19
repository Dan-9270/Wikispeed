import {LogoTitle, PlayShare, Podium, Ranking, RePlayButton} from './component/Component'
import {CreditButton} from './component/Component'
import {BottomRedirection} from './component/Component'
import { MusicPlayer } from './component/MusicComponent'
import Damien from './assets/avatar/Avatar_Damien.svg'
import images from './assets/monster/images'



import './style/wikispeed.css'
import { Background } from './assets/back'
import { Player } from './types/Player'
import { sharedChatManager } from "./chatManager.ts";
import { useLocation } from 'react-router-dom'


function EndGame(){
    const location = useLocation();
    const listPlayer:Player[] = location.state.listPlayer;
    const player:Player = location.state.player;
    const players:String[] = location.state.players;


    
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
    <MusicPlayer/>


        <Podium ranking={listPlayer}></Podium> 
            </section>
            <section id='bot'>
            <BottomRedirection content="See the ranking" link="#bot"/>

         <Ranking ranking={listPlayer}/> 
         <RePlayButton player={player} players={players}/>
         </section>

        </main>
    </>
}
export default EndGame