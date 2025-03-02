import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import {CreateGame} from './component/GameComponent'
import {JoinGame} from './component/GameComponent'
import images from './assets/monster/images'
import { MusicPlayer } from './component/MusicComponent'


import './style/wikispeed.css'
import { Background } from './assets/back'

function MultiCreation() {

  return (
        <>
          <Background></Background>
            <CreditButton />
            <LogoTitle />
            <MusicPlayer />



            <div className='MultiCreation'>

              
                <CreateGame/>
                <JoinGame>
                  <div id="monster_8">
                    <img className='monsters' id='m8' src={images.daniel} alt="" />
                  </div>
                </JoinGame>
                
            </div>
        </>
  )
}

export default MultiCreation
