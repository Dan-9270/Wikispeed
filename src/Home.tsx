import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
import {NextHome, SelectMode} from './component/SelectMode'
import {SetProfile} from './component/SetProfile'
import {RuleBlox} from './component/Component'
import {PlayButton} from './component/RouteComponent'
import {ArtifactsList} from './component/Component'
import {Footer} from './component/Component'
import {Title} from './component/Component'
import { MusicPlayer } from './component/MusicComponent'
import images from './assets/monster/images'
import { SoundPlayer } from './component/MusicComponent'
import {BottomRedirection} from './component/Component'

import hover from './assets/music/hover.mp3';
import click from './assets/music/click.mp3';
import monster from './assets/music/monster.mp3';




import './style/wikispeed.css'
import { Background } from './assets/back'

function Home() {
  const artifacts = [{name:'Mine',description:'FTG Khephren si tu trouves ca moche c pas mon probleème',img:mine},{name:'Map',description:'Flop sale batard',img:map},{name:'Map',description:'Flop sale batard',img:map},{name:'Map',description:'Flop sale batard',img:map},{name:'Map',description:'Flop sale batard',img:map}];

  return (

        <>
          <SoundPlayer hoverSound={monster} clickSound={click} volume={0.3}>                
            <div id='monster_1' >
              <img className='monsters mleft-rotate' id='m1' src={images.benjamin} alt="" />
            </div>

            <div id="monster_2">
              <img className='monsters mright' id='m2' src={images.pommier} alt="" />
            </div>

            <div id="monster_3">
              <img className='monsters mright' id='m3' src={images.daniel} alt="" />
            </div>

            <div id="monster_4">
              <img className='monsters mleft' id='m4' src={images.titouan} alt="" />
            </div>
          </SoundPlayer>


            <Background/>
            <CreditButton />
            <MusicPlayer />
                <section className="main-page" id='top'>
 
               <LogoTitle />

                 <div className="selection-container">
                    <div className="selection"> 
                    <SoundPlayer hoverSound={hover} clickSound={click} volume={0.3}>                
                    <SelectMode title='Solo' img={images.green} link='solocreation'/>
                    </SoundPlayer>

                    <SetProfile image={images.damien} username={undefined} />
                    <NextHome title="Jouer" link="homephone"></NextHome>

                    <SoundPlayer hoverSound={hover} clickSound={click} volume={0.3}>                
                    <SelectMode title='Multijoueur' img={images.bibabo} link='multicreation'/> 
                    </SoundPlayer>
                    </div>
                 </div>
                 </section>

                <section className='second-part' id="rules"> 
                <BottomRedirection content="How To Play" link="#rules"/>
                <Title title='How to play ?'></Title>
                  <div className="rule-list" >
                      <RuleBlox content='1. Crées une partie Lance une partie en solo ou avec des amis.' /> 
                      <RuleBlox content='2. Découvre ta liste d’articles Tu reçois une liste d’articles Wikipédia à visiter.' />
                      <RuleBlox content='3. Navigue d’article en articles Clique sur les liens internes de Wikipédia pour avancer d’un article à l’autre.' />
                      
                      <RuleBlox content='4. Sois le plus rapide !Le premier à avoir visité tous ses articles remporte la partie.'>
                      <div id="monster_6">
                        <img className='monsters' id='m6' src={images.cornu} alt="" />
                      </div>
                      </RuleBlox>
                  </div>

                  <Title title='Artéfacts'></Title>
                  <ArtifactsList artifacts={artifacts}/>
                  <PlayButton/>
                  


            <Footer content1='Aide' content2='Confidentialités' content3='Mentions Légales'>
              {/* <div id="monster_7">
                <img className='monsters' id='m7' src={images.neuille} alt="" />
              </div> */}
            </Footer>
            </section>

  

          

        </>
      
      
  )
}

export default Home
