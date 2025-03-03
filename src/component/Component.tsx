import logo from '../assets/Logo.svg'
import { FaShare } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import crown from '../assets/icons/crown.svg'
import images from '../assets/monster/images'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark} from "@fortawesome/free-solid-svg-icons";
import { useRedirect } from "../script/Redirection";


import type { Player } from '../types/Player.ts';
import {Artifact,Artifacts} from "./Artifact.tsx";
export const LogoTitle = () =>{
  const redirectTo = useRedirect();
    return <figure className='logo'><img src={logo} alt=""  onClick={() => redirectTo("/")}/></figure>
           
}

export const CreditButton = () =>{
    return <div className='credit-button'>
      <p className='manjari'>Credits</p>
      </div>
}


export const ArtifactsList = (props:{artifacts : Artifact[]}) => {

  return (
    <div className="artifacts-list">
      {props.artifacts.map((artifact, index) => (
        <Artifacts key={index} artifact={artifact} />
      ))}
    </div>
  );
};



export const RuleBlox = (props :{content : string ,children?: React.ReactNode }) =>{
    return <div className='rule-bloc'>
      <span className='rules'> {props.content}</span>
      {props.children}
      </div>
} 

export const Title = (props :{title : string}) => {
  return <p className='title'> {props.title} </p>
}


export const Footer = (props :{content1 : string, content2 : string, content3 : string, children?: React.ReactNode }) => {
  return (
    <div className='footer'>
      <p> {props.content1}</p>
      <p> {props.content2}</p>
      <p> {props.content3}</p>
    </div>
  );

}
export const BottomRedirection = (props :{link : string,content:string}) =>{
  return <a className="bottomredirection manjari" href={props.link}><p>{props.content}</p>
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37" fill="none">
  <path d="M32.2314 7.60343L4.98927 7.81988C4.71346 7.82294 4.44371 7.90115 4.20905 8.04612C3.97439 8.19108 3.78371 8.39729 3.65753 8.64256C3.53136 8.88783 3.47446 9.16287 3.49296 9.43807C3.51147 9.71327 3.60468 9.97822 3.76257 10.2044L17.54 29.771C18.111 30.5823 19.47 30.5715 20.0296 29.7512L33.4943 9.96815C33.6502 9.73996 33.7405 9.47343 33.7556 9.1975C33.7706 8.92157 33.7097 8.64681 33.5795 8.40306C33.4493 8.1593 33.2548 7.95589 33.0172 7.81491C32.7795 7.67394 32.5077 7.60079 32.2314 7.60343Z" fill="white"/>
  </svg>
</a>
}
export const Podium=(props:{ranking:Array<Player>})=>{
    return (
        <ul className="podium manjari">
            {props.ranking[1] && (
                <li className="second">
                    <div className="avatar">
                        <img src={props.ranking[1].avatar} alt={props.ranking[1].name} />
                    </div>
                    <div className="block">
                        <h1>2</h1>
                        <p className="name">{props.ranking[1].name}</p>
                        <p className="time">{props.ranking[1].time}s</p>
                    </div>
                </li>
            )}
            {props.ranking[0] && (
                <li className="first">
                    <div className="avatar">
                        <img src={crown} alt="crown"/>
                        <img src={props.ranking[0].avatar} alt={props.ranking[0].name} />
                    </div>
                    <div className="block">
                        <h1>1</h1>
                        <p className="name">{props.ranking[0].name}</p>
                        <p className="time">{props.ranking[0].time}s</p>

                        <div id="monster_11">
                          <img className='monsters' id='m11' src={images.neuille} alt="" />
                        </div>

                    </div>
                </li>
            )}
            {props.ranking[2] && (
                <li className="third">
                    <div className="avatar">
                        <img src={props.ranking[2].avatar} alt={props.ranking[2].name} />
                    </div>
                    <div className="block">
                        <h1>3</h1>
                        <p className="name">{props.ranking[2].name}</p>
                        <p className="time">{props.ranking[2].time}s</p>
                    </div>
                </li>
            )}
        </ul>
    );
}
const Rank = (props :{player:Player,position:number}) => {
    return <li className="playerRank"><p>{props.position}</p><img src={props.player.avatar} alt={props.player.name}/><p>{props.player.name}</p><p>{props.player.time}</p><p>{props.player.score}</p></li>
}
export const Ranking=(props :{ranking:Array<Player>})=>{
    return <ul className="ranking manjari" id="bottom">{
        props.ranking.map((r, i) => {
            return <Rank key={i} player={r} position={i + 1}/>
        })
    }</ul>
}



export function Button(props: { choix: string; value: string }) {
  const id = `${props.choix}-${props.value}`;
  return (
    <span className="span-radio"> 
      <input type="radio" name={props.choix} id={id} className="input-radio" />
      <label htmlFor={id} className="input-label" id={props.value == 'OUI' ? 'oui' : 'non'}>
        {props.value}
      </label>
    </span>
  );
}

export function List(props: { children: string }) {
  return <select name="list" id="list" className="">
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? '1 article' : '3 minutes'}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 2 : 5}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 3 : 10}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 4 : 15}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 5 : 20}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 6 : 25}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 7 : 30}</option>
      <option value={props.children == 'article' ? 'art ' : 'time'}>{props.children == 'article' ? 8 : '--'}</option>
      
  </select>;
}

export const SoloRanking=(props:{ranking:Array<Player>})=>{
  return (

    <div className='SoloRanking'>
        <p className='rank_title'>Partie terminée !</p>
        <img className='rank_avatar' src={props.ranking[1].avatar} alt={props.ranking[1].name} />
        <p>{props.ranking[1].name}</p>
        <p className='rank_title'>Récap de la partie :</p>
        <p>Temps : 2:30</p>
        <p>Nombre d’articles trouvées : 5/5</p>
        <p>Nombre d’articles parcourus : 16</p>
    </div>
  );
}

export const PlayShare=() =>{
  return(
    <div className="container_button">
      <button className="button">Partager<FaShare/></button>
      <button className="button">Demarrer<FaPlay/> </button>
    </div>
  );
}


export const DeletePLayer=(props:{player: string})=>{
  return (
    <FontAwesomeIcon icon={faSquareXmark} id={props.player} className='delete-player'/>
  );
}