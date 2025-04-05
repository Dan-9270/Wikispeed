import { useState } from 'react'; // Importer useState pour gérer l'état du nom d'utilisateur
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour gérer la navigation
import { LogoTitle, CreditButton, RuleBlox, ArtifactsList, Footer, Title, BottomRedirection } from './component/Component';
import { SelectMode, NextHome } from './component/SelectMode';
import { SetProfile } from './component/SetProfile';
import { MusicPlayer, SoundPlayer } from './component/MusicComponent';
import mine from './assets/artifact/mine.svg';
import map from './assets/artifact/map.svg';
import snail from './assets/artifact/escargot.svg';
import images from './assets/monster/images';
import hover from './assets/music/hover.mp3';
import click from './assets/music/click.mp3';
import monster from './assets/music/monster.mp3';
import { Background } from './assets/back';
import './style/wikispeed.css';
import { Link } from "react-router-dom";


function Home() {
  localStorage.clear();
  const [inputValue, setInputValue] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('/src/assets/avatar/Avatar_damien.svg'); 
  const [isNameChoosen, setIsNameChosen] = useState(false); // État pour savoir si le nom est choisi

  const navigateToSolo = useNavigate(); 

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar); // Mets à jour l'avatar
  };
 
  console.log('Avatar sélectioé :', avatar);

  // Validation de l'input
  const isInputValid = inputValue.trim() !== '';
  
  // Fonction de navigation
  const navigateToPage = (link: string) => {
    if (!isInputValid) {
      alert('Veuillez remplir le champ utilisateur.');
      return;
    }
    else {
      try {
      navigateToSolo(link, { state: { username: inputValue , avatar: avatar} });
    } catch (error) {
      console.error('Erreur de navigation :', error);
    }
  };}
 
  const artifacts = [
    { name: 'Mine', description: 'FTG Khephren si tu trouves ça moche, c\'est pas mon problème', img: mine },
    { name: 'Map', description: 'Flop sale bâtard', img: map },
    { name: 'Compas', description: 'Un guide de la navigation', img: map }, // Exemple d'artefact varié
    { name: 'Carte', description: 'Une carte secrète', img: map },
    { name: 'Boussole', description: 'Une boussole pour t\'orienter', img: map }
  ];

  console.log('Nom d\'utilisateur :', isNameChoosen);
  return (
    <>
      <SoundPlayer hoverSound={monster} clickSound={click} volume={0.3}>                
        <div id="monster_1">
          <img className="monsters mleft-rotate" id="m1" src={images.benjamin} alt="Monstre Benjamin" />
        </div>
        <div id="monster_2">
          <img className="monsters mright" id="m2" src={images.pommier} alt="Monstre Pommier" />
        </div>
        <div id="monster_3">
          <img className="monsters mright" id="m3" src={images.daniel} alt="Monstre Daniel" />
        </div>
        <div id="monster_4">
          <img className="monsters mleft" id="m4" src={images.titouan} alt="Monstre Titouan" />
        </div>
      </SoundPlayer>

      <Background />
      <CreditButton />
      <MusicPlayer />

      <section className="main-page" id="top">
        <LogoTitle />

        <div className="selection-container">
          <div className="selection">
            <SoundPlayer hoverSound={hover} clickSound={click} volume={0.3}>                
            <SelectMode 
                title="Solo" 
                img={images.green} 
                link="solocreation" 
                isInputValid={isInputValid} // Contrôle la validation
                onClick={() => navigateToPage('./game')} 
              />
            </SoundPlayer>

            <div className='profil-pc'>
              <SetProfile username={inputValue} onChange={(event) => setInputValue(event.target.value)} onAvatarChange={handleAvatarChange}/> 
            </div>
            {!isNameChoosen && <div className='profil-phone'>
              <SetProfile username={inputValue} onChange={(event) => setInputValue(event.target.value)} onAvatarChange={handleAvatarChange}/> 
            </div>}

            <NextHome title="Jouer" onClick={() => { isInputValid ? setIsNameChosen(true) : null }} />
            
            <SoundPlayer hoverSound={hover} clickSound={click} volume={0.3}> 
              <SelectMode 
                title="Multijoueur" 
                img={images.bibabo} 
                link="multicreation" 
                isInputValid={isInputValid} // Contrôle la validation
                onClick={() => navigateToPage('./multicreation')} 
              />
            </SoundPlayer>
          </div>
        </div>

      </section>

      <section className="second-part" id="rules">
        <BottomRedirection content="How To Play" link="#rules" />
        <Title title="How to play ?" />
        <div className="rule-list">
          <RuleBlox content="1. Crée une partie. Lance une partie en solo ou avec des amis." />
          <RuleBlox content="2. Découvre ta liste d'articles. Tu reçois une liste d'articles Wikipédia à visiter." />
          <RuleBlox content="3. Navigue d'article en article. Clique sur les liens internes de Wikipédia pour avancer d'un article à l'autre." />
          <RuleBlox content="4. Sois le plus rapide ! Le premier à avoir visité tous ses articles remporte la partie.">
            <div id="monster_6">
              <img className="monsters" id="m6" src={images.cornu} alt="Monstre Cornu" />
            </div>
          </RuleBlox>
        </div>

        <Title title="Artéfacts" />
        <ArtifactsList artifacts={artifacts} />

      
        <Footer content1="Aide" content2="Confidentialités" content3="Mentions Légales" />
        <Link to="/endgame">Aller à la page About</Link>
      </section>
    </>
  );
}

export default Home;
