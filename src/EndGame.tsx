import {LogoTitle, Podium, Ranking} from './component/Component'
import {CreditButton} from './component/Component'
import {BottomRedirection} from './component/Component'

import Damien from './assets/avatar/Avatar_damien.svg'
import images from './assets/monster/images'



import './style/wikispeed.css'
import { Background } from './assets/back'

function EndGame(){
    const ranking=[{id:1,name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},{id:2,name:"Damien",time:200,avatar:Damien,score:20},{id:3,name:"Damien",time:200,avatar:Damien,score:20},{id:4,name:"Damien",time:200,avatar:Damien,score:20},{id:5,name:"Damien",time:200,avatar:Damien,score:20},{id:6,name:"Damien",time:200,avatar:Damien,score:20}];
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
        <Podium ranking={ranking}></Podium>
    <BottomRedirection content="See the ranking" link="#bottom"/>
            </section>
        <Ranking ranking={ranking}/>
        </main>
    </>
}
export default EndGame