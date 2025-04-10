import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Home'
import HomePhone from './HomePhone'
import MultiCreation from './MultiCreation'
import MultiShare from './MultiShare'
import MultiGame from './MultiGame'
import EndGame from './EndGame'
import './style/App.css'
import './style/wikispeed.css'
import { Game } from "./Game";

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
        <Route path="/game" element={<Game />} />
      
        <Route path="/endgame" element={<EndGame/>} />
        </Routes>
    </Router>
   
    </AudioProvider>
    

  );
}

export default App
