import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import { MusicPlayer } from './component/MusicComponent'
import { RealChatter } from './component/Chat';
import { sharedChatManager } from './chatManager';
import { useLocation } from 'react-router-dom';
import './style/wikispeed.css'
import { Background } from './assets/back'

function MultiCreation() {

  const location = useLocation();
  const username = location.state.username;
  const avatar = location.state.avatar;

  return (
        <>
              <div className="page">
          <Background></Background>
            <CreditButton />
            <LogoTitle />
            <MusicPlayer/>


      
            <div className='MultiCreation'>

              
                     <RealChatter name={username} photo={avatar} chatManager={sharedChatManager} />
               
                
            </div>
            </div>
        </>
  )
}

export default MultiCreation
