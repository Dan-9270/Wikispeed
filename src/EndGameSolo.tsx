import {LogoTitle, SoloRanking} from './component/Component'
import {CreditButton} from './component/Component'
import {PlayShare} from './component/Component'

import Damien from './assets/avatar/Avatar_damien.svg'
import images from './assets/monster/images'



import './style/wikispeed.css'
import { Background } from './assets/back'

function EndGameSolo(){
    const ranking=[{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},{id:2,name:"Damien",time:200,avatar:Damien,score:20},{id:3,name:"Damien",time:200,avatar:Damien,score:20},{id:4,name:"Damien",time:200,avatar:Damien,score:20},{id:5,name:"Damien",time:200,avatar:Damien,score:20},{id:6,name:"Damien",time:200,avatar:Damien,score:20}];
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

        <SoloRanking ranking={ranking}></SoloRanking>
        <PlayShare></PlayShare>
            </section>
        </main>
    </>
}
export default EndGameSolo