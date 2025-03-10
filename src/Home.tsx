import { useState } from 'react'; // Importer useState pour gérer l'état du nom d'utilisateur
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour gérer la navigation
import { LogoTitle, CreditButton, RuleBlox, ArtifactsList, Footer, Title, BottomRedirection } from './component/Component';
import { SelectMode, NextHome } from './component/SelectMode';
import { SetProfile } from './component/SetProfile';
import { MusicPlayer, SoundPlayer } from './component/MusicComponent';
import mine from './assets/artifact/mine.svg';
import map from './assets/artifact/map.svg';
import images from './assets/monster/images';
import hover from './assets/music/hover.mp3';
import click from './assets/music/click.mp3';
import monster from './assets/music/monster.mp3';
import { Background } from './assets/back';
import './style/wikispeed.css';
import { PlayButton } from './component/RouteComponent';

function Home() {


  const [inputValue, setInputValue] = useState<string>('');
  const navigateToSolo = useNavigate(); 
  const navigateToPage = (link: string) => {
    if (inputValue.trim() === '') {
      alert('Veuillez remplir le champ utilisateur.');
      return;  // Ne pas continuer si inputValue est vide
    }
    navigateToSolo(link, { state: { username: inputValue } });
  };

  const artifacts = [
    { name: 'Mine', description: 'FTG Khephren si tu trouves ça moche, c\'est pas mon problème', img: mine },
    { name: 'Map', description: 'Flop sale bâtard', img: map },
    { name: 'Map', description: 'Flop sale bâtard', img: map },
    { name: 'Map', description: 'Flop sale bâtard', img: map },
    { name: 'Map', description: 'Flop sale bâtard', img: map }
  ];

  return (
    <>
    <button
  disabled={inputValue.trim() === ''}  // Désactive le bouton si inputValue est vide
  onClick={() => navigateToPage('./solocreation')}
>
  Jouer
</button>
      <SoundPlayer hoverSound={monster} clickSound={click} volume={0.3}>                
        <div id="monster_1">
          <img className="monsters mleft-rotate" id="m1" src={images.benjamin} alt="" />
        </div>
        <div id="monster_2">
          <img className="monsters mright" id="m2" src={images.pommier} alt="" />
        </div>
        <div id="monster_3">
          <img className="monsters mright" id="m3" src={images.daniel} alt="" />
        </div>
        <div id="monster_4">
          <img className="monsters mleft" id="m4" src={images.titouan} alt="" />
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
                onClick={() => navigateToPage('./solocreation')} 
              />
            </SoundPlayer>

            <SetProfile username={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <NextHome title="Jouer" link="homephone" />

            <SoundPlayer hoverSound={hover} clickSound={click} volume={0.3}>                
              <SelectMode 
                title="Multijoueur" 
                img={images.bibabo} 
                link="multicreation" 
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
          <RuleBlox content="2. Découvre ta liste d’articles. Tu reçois une liste d’articles Wikipédia à visiter." />
          <RuleBlox content="3. Navigue d’article en article. Clique sur les liens internes de Wikipédia pour avancer d’un article à l’autre." />
          <RuleBlox content="4. Sois le plus rapide ! Le premier à avoir visité tous ses articles remporte la partie.">
            <div id="monster_6">
              <img className="monsters" id="m6" src={images.cornu} alt="" />
            </div>
          </RuleBlox>
        </div>

        <Title title="Artéfacts" />
        <ArtifactsList artifacts={artifacts} />
       <PlayButton></PlayButton>

        <Footer content1="Aide" content2="Confidentialités" content3="Mentions Légales" />
      </section>
    </>
  );
}

export default Home;
