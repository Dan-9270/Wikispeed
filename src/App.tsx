import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home'
import HomePhone from './HomePhone'
import MultiCreation from './MultiCreation'
import MultiShare from './MultiShare'
import MultiGame from './MultiGame'
import SoloCreation from './SoloCreation'
import EndGame from './EndGame'
import EndGameSolo from './EndGameSolo'
//import Pagea from './pagea'
//import Pageb from './pageb'
import Test from './test'
 
import './style/App.css'
import './style/wikispeed.css'
import SoloGame from "./SoloGame";

import { AudioProvider } from './script/AudioContext';

function App() {

  return (
    <AudioProvider>
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homephone" element={<HomePhone />} />
        <Route path="/multicreation" element={<MultiCreation />} />
        <Route path="/multishare" element={<MultiShare />} />
      
        {/*<Route path="/pagea" element={<Pagea />} />
        <Route path="/pageb" element={<Pageb />} />*/}
        <Route path="/multigame" element={<MultiGame />} />
        <Route path="/sologame" element={<SoloGame />} />
        
        <Route path="/solocreation" element={<SoloCreation />} />
        <Route path="/endgame" element={<EndGame/>} />
        
        <Route path="/endgamesolo" element={<EndGameSolo/>} />
        <Route path="/test" element={<Test/>}/>
        </Routes>
    </Router>
   
    </AudioProvider>
    

  );
}

export default App
