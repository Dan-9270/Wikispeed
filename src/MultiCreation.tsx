import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import {CreateGame} from './component/GameComponent'
import {JoinGame} from './component/GameComponent'
import images from './assets/monster/images'


import './style/wikispeed.css'

function MultiCreation() {

  return (
        <>
            <CreditButton />
            <LogoTitle />

            <div id="monster_8">
              <img className='monsters' id='m8' src={images.daniel} alt="" />
            </div>

            <div className='MultiCreation'>
                <CreateGame/>
                <JoinGame/>
            </div>
        </>
  )
}

export default MultiCreation
