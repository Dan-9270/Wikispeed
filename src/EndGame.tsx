import {LogoTitle, Podium, Ranking} from './component/Component'
import {CreditButton} from './component/Component'
import {BottomRedirection} from './component/Component'
import Damien from './assets/avatar/Avatar_damien.svg'


import './style/wikispeed.css'

function EndGame(){
    const ranking=[{name:"Damqdqsdqsdqdqsdien",time:200,avatar:Damien,score:20},{name:"Damien",time:200,avatar:Damien,score:20},{name:"Damien",time:200,avatar:Damien,score:20},{name:"Damien",time:200,avatar:Damien,score:20},{name:"Damien",time:200,avatar:Damien,score:20},{name:"Damien",time:200,avatar:Damien,score:20}];
    return <>
        <main>
            <section className="hero">
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