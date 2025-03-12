import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import {CreateGame} from './component/GameComponent'
import {JoinGame} from './component/GameComponent'
import images from './assets/monster/images'
import { MusicPlayer } from './component/MusicComponent'
import { WebSocketChatManager } from './component/WebSocketChatManager';
import { Chatter, RealChatter } from './component/Chat';
import { sharedChatManager } from './chatManager';
import { useNavigate, useLocation } from 'react-router-dom';

import './style/wikispeed.css'
import { Background } from './assets/back'

function MultiCreation() {

  const navigateToSolo = useNavigate(); 
  const location = useLocation();
  if (!location.state) {
    console.log("Aucun état trouvé");}
  const username = location.state.username;
  console.log("Nom d'utilisateur:", username);

  const navigateToPage = (link: string  ) => {
    if (!username) {
      return;  
    }
    else {
      try {
      navigateToSolo(link, { state: { username } });
    } catch (error) {
      console.error('Erreur de navigation :', error);
    }
  };}
  return (
        <>
              <div className="page">
          <Background></Background>
            <CreditButton />
            <LogoTitle />
            <MusicPlayer />


      
            <div className='MultiCreation'>

              
                     <RealChatter name={username} chatManager={sharedChatManager} />
               
                
            </div>
            </div>
        </>
  )
}

export default MultiCreation
