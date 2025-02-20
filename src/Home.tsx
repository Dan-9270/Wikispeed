import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import green from './assets/monster/green.svg'

import {SelectMode} from './component/SelectMode'
import './style/wikispeed.css'

function Home() {

  return (

        <body>
              {/* <LogoTitle />
                <CreditButton />
                 */}
                 <SelectMode title='Solo' img={green}/>
        </body>
      
      
  )
}

export default Home
