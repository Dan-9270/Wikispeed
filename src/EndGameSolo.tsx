import {LogoTitle, SoloRanking} from './component/Component'
import {CreditButton} from './component/Component'
import {PlayShare} from './component/Component'
import images from './assets/monster/images'

import './style/wikispeed.css'
import { Background } from './assets/back'
import { Game } from './Game'

function EndGameSolo(props:{game:Game; onChangeGameState:(state:string)=> void}){
    return <>
        <Background></Background>
        <main>
            <section className="hero">

            <div id="monster_13">
              <img className='monsters' id='m13' src={images.daniel} alt="" />
            </div>

            <div id="monster_14">
              <img className='monsters' id='m14' src={images.degrado} alt="" />
            </div>
            
    <CreditButton/>
    <LogoTitle/>

        <SoloRanking
          ranking={props.game.players}
          gameduration={
            props.game.endTime !== undefined && props.game.startTime !== undefined
              ? Math.floor((props.game.endTime - props.game.startTime) / 1000)
              : 0
          }
        />
        
        <PlayShare onChangeGameState={props.onChangeGameState}></PlayShare>
            </section>
        </main>
    </>
}
export default EndGameSolo