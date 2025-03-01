import { useState, useEffect } from 'react'
import { Artifact } from './Artifact';
import { ArtifactsList } from './Component';
import type { Player } from '../types/Player.ts';


export function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div className="timer">
            <h3 className='manjari'>Temps Écoulé</h3>
            <p className='manjari'>{minutes}:{remainingSeconds}</p>
        </div>
  )
}

export const ArticleList=(props:{names : string[] }) =>{
    return <div className="article-list">
        <ul className='manjariB'>
          {props.names.map((name, index) => (
            <>
            <li className="article-name" key={index}>{name} </li>
            <li>{index !== props.names.length - 1 ? '-' : ''} </li>
            </>
          ))}
        </ul>
      </div>
    
  }
  export const PlayerInfo = (props:{player:Player[],names : string[]}) =>{
    return <div className='player-info'>
        <h2 className='manjari'>Joueurs</h2>
        <ul>
        {props.player.map((player) => (
          <>
          <li><p className='manjari'> {player.name}</p>
          <p className='manjari  player-score'> {player.score}/{props.names.length}</p>
          </li>
          </>
        ))}
        </ul>  
      </div>
  }

export const Inventory = (props:{artifact1 :Artifact, artifact2 : Artifact }) =>{
    const names = [props.artifact1.img,props.artifact2.img]
    return <div className='inventory'>
        <h2 className='manjari'> Inventaire</h2>
        <div className='inventory-artifact'>
            <ArtifactsList imgs={names} ></ArtifactsList> 
          </div>
        </div>
}
