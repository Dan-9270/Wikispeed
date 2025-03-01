import { LogoTitle } from './component/Component'
import {CreditButton} from './component/Component'
import back from './assets/back.svg'
import mine from './assets/artifact/mine.svg'
import map from './assets/artifact/map.svg'
import {SelectMode} from './component/SelectMode'
import {SetProfile} from './component/SetProfile'
import {RuleBlox} from './component/Component'
import {PlayButton} from './component/RouteComponent'
import {ArtifactsList} from './component/Component'
import {Footer} from './component/Component'
import {Title} from './component/Component'
import { Link } from "react-router-dom";
import images from './assets/monster/images'



import {BottomRedirection} from './component/Component'



import './style/wikispeed.css'
import { Background } from './assets/back'

function Home() {
  const artifactImages = [mine,map,map,map,map,map,map
    
  ]; 

  return (

        <>
              
            <div id='monster_1'>
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

            {/* <div id="monster_5">
              <img className='monsters' id='m5' src={images.damien} alt="" />
            </div> */}




            <Background/>
            <CreditButton />
                <section className="main-page">
 
               <LogoTitle />

                 <div className="selection-container">
                    <div className="selection">                 
                    <SelectMode title='Solo' img={images.green} link='solocreation'/>
                    <SetProfile image={images.damien} username={undefined} />
                    <SelectMode title='Multijoueur' img={images.bibabo} link='multicreation'/> 
                    </div>
                 </div>
                 <BottomRedirection content="How To Play" link="#rules"/>
                 </section>

                
                  <Title title='How to play ?'></Title>
                  <div className="rule-list" id="rules">
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
                  <ArtifactsList imgs={artifactImages}/>
                  <PlayButton/>
                  


            <Footer content1='Aide' content2='Confidentialités' content3='Mentions Légales'>
              {/* <div id="monster_7">
                <img className='monsters' id='m7' src={images.neuille} alt="" />
              </div> */}
            </Footer>
  

          

        </>
      
      
  )
}

export default Home
