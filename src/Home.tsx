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
import {CreateGame} from './component/GameComponent'
import {JoinGame} from './component/GameComponent'
import {Setting} from './component/GameComponent'
import { Link } from "react-router-dom";

import {BottomRedirection} from './component/Component'

import images from './assets/monster/images'


import './style/wikispeed.css'

function Home() {
  const artifactImages = [mine,map,map,map,map,map,map
    
  ]; 

  return (

        <>

              
            <img className='monsters' src={images.green} alt="" />






                <section className="main-page">
              <CreditButton />
               <LogoTitle />

                 <div className="selection-container">
                    <div className="selection">                 
                    <SelectMode title='Solo' img={images.green} link='solocreation'/>
                    <SetProfile image={images.damien} username={undefined} />
                    <SelectMode title='Multijoueur' img={images.bibabo} link='multicreation'/> 
                    </div>
                 </div>
                 <BottomRedirection content="How To Play" link="#rules"/>
                 <figure className='background'><img src={back} alt="" /></figure>  
                 </section>

                
                  <Title title='How to play ?'></Title>
                  <div className="rule-list" id="rules">
                      <RuleBlox content='1. Crées une partie Lance une partie en solo ou avec des amis.' /> 
                      <RuleBlox content='2. Découvre ta liste d’articles Tu reçois une liste d’articles Wikipédia à visiter.' />
                      <RuleBlox content='3. Navigue d’article en articles Clique sur les liens internes de Wikipédia pour avancer d’un article à l’autre.' />
                      <RuleBlox content='4. Sois le plus rapide !Le premier à avoir visité tous ses articles remporte la partie.' />
                  </div>

                  <Title title='Artéfacts'></Title>
                  <ArtifactsList imgs={artifactImages}/>
                  <PlayButton/>
                  <Link to="/multigame">Aller à Multigame</Link>
                  <Link to="/sologame">Aller à SoloGame</Link>
                  <Footer content1='Aide' content2='Confidentialités' content3='Mentions Légales'></Footer>
  

                
        </>
      
      
  )
}

export default Home
