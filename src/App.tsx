import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home'
import HomePhone from './HomePhone'
import MultiCreation from './MultiCreation'
import MultiShare from './MultiShare'
import MultiGame from './MultiGame'
import SoloCreation from './SoloCreation'
import EndGame from './EndGame'
import EndGameSolo from './EndGameSolo'
 
import './style/App.css'
import './style/wikispeed.css'
import SoloGame from "./SoloGame";
import MultiSharePhone from "./MultiSharePhone";
import SoloCreationPhone from "./SoloCreationPhone";


function App() {
  
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homephone" element={<HomePhone />} />
        <Route path="/multicreation" element={<MultiCreation />} />
        <Route path="/multishare" element={<MultiShare />} />
        <Route path="/multisharephone" element={<MultiSharePhone />} />

        <Route path="/multigame" element={<MultiGame />} />
        <Route path="/sologame" element={<SoloGame />} />
        <Route path="/solocreationphone" element={<SoloCreationPhone />} />
        <Route path="/solocreation" element={<SoloCreation />} />
        <Route path="/endgame" element={<EndGame/>} />
        <Route path="/endgamesolo" element={<EndGameSolo/>} />

      </Routes>
    </Router>
  );
}

export default App
