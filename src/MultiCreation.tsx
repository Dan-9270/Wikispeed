import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import {CreateGame} from './component/GameComponent'
import {JoinGame} from './component/GameComponent'
import images from './assets/monster/images'
import { MusicPlayer } from './component/MusicComponent'
import { WebSocketChatManager } from './component/WebSocketChatManager';
import { Chatter, RealChatter } from './component/Chat';
import { sharedChatManager } from './chatManager';


import './style/wikispeed.css'
import { Background } from './assets/back'

function MultiCreation() {

  return (
        <>
              <div className="page">
          <Background></Background>
            <CreditButton />
            <LogoTitle />
            <MusicPlayer />


      
            <div className='MultiCreation'>

              
                     <RealChatter chatManager={sharedChatManager} />
               
                
            </div>
            </div>
        </>
  )
}

export default MultiCreation
