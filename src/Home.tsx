import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import green from './assets/monster/green.svg'
import bibabo from './assets/monster/bibabo.svg'

import {SelectMode} from './component/SelectMode'
import {SetProfile} from './component/SetProfile'
import {RuleBlox} from './component/Component'
import {PlayButton} from './component/Component'
import {ArtifactsList} from './component/Component'
import {Footer} from './component/Component'

import './style/wikispeed.css'

function Home() {

  return (

        <body>
                <CreditButton />
               <LogoTitle />

                 <div className="selection">                 
                    <SelectMode title='Solo' img={green}/>
                    <SetProfile image={green} username={undefined} />
                    <SelectMode title='Multijoueur' img={bibabo}/> 

                 </div>

                  <RuleBlox content='1. Crées une partie Lance une partie en solo ou avec des amis.' /> 
                  <Footer content1='Aide' content2='Confidentialités' content3='Mentions Légales'></Footer>
                 <PlayButton/>

                 <ArtifactsList/>
        </body>
      
      
  )
}

export default Home
