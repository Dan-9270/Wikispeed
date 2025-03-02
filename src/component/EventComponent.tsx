import { useState, useEffect } from 'react'
import { Artifact } from './Artifact';
import { ArtifactsList } from './Component';
import type { Player } from '../types/Player.ts';
import { createPortal } from "react-dom";



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

export const PlayerInfo = (props: { players: Player[], articles: string[] }) => {
    const [visibility, setVisibility] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 900);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {isDesktop ? (
                <div className="manjari player-info">
                    <h2>Joueurs</h2>
                    <ul>
                        {props.players.map((player, i) => (
                            <li key={i}>
                                <p className="manjari">{player.name}</p>
                                <p className="manjari player-score">{player.score}/{props.articles.length}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <>
                    {visibility &&
                        createPortal(
                            <div className="manjari player-info-modal">
                                <h2>Joueurs</h2>
                                <button className="closebutton manjari" onClick={() => setVisibility(false)}>x</button>
                                <ul>
                                    {props.players.map((player, i) => (
                                        <li key={i}>
                                            <p className="manjari">{player.name}</p>
                                            <p className="manjari player-score">{player.score}/{props.articles.length}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>,
                            document.body
                        )
                    }

                    {!visibility &&
                        createPortal(
                            <button className="player-info-button" onClick={() => setVisibility(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 43 43" fill="none">
                                    <path d="M21.5002 25.0832C23.9745 25.0832 26.214 24.0798 27.8355 22.4584C29.4552 20.8387 30.4585 18.5991 30.4585 16.1248C30.4585 13.6505 29.4552 11.411 27.8355 9.7913C26.214 8.16984 23.9745 7.1665 21.5002 7.1665C19.0259 7.1665 16.7863 8.16984 15.1648 9.7913C13.5452 11.411 12.5418 13.6505 12.5418 16.1248C12.5418 18.5991 13.5452 20.8387 15.1648 22.4584C15.9967 23.2905 16.9844 23.9506 18.0714 24.401C19.1584 24.8513 20.3235 25.0832 21.5002 25.0832ZM35.8335 26.8748C36.422 26.876 37.005 26.761 37.549 26.5363C38.093 26.3116 38.5872 25.9817 39.0034 25.5656C39.4195 25.1494 39.7494 24.6551 39.9741 24.1112C40.1988 23.5672 40.3138 22.9842 40.3127 22.3957C40.3127 21.1594 39.8128 20.0396 39.0012 19.228C38.5851 18.8121 38.0913 18.4822 37.5478 18.2572C37.0043 18.0322 36.4217 17.9164 35.8335 17.9165C35.245 17.9153 34.662 18.0304 34.118 18.2551C33.574 18.4797 33.0798 18.8096 32.6636 19.2258C32.2475 19.642 31.9176 20.1362 31.6929 20.6802C31.4682 21.2241 31.3531 21.8071 31.3543 22.3957C31.3534 22.9841 31.4686 23.567 31.6934 24.1109C31.9181 24.6548 32.248 25.1489 32.6641 25.565C33.0803 25.9811 33.5744 26.311 34.1183 26.5358C34.6621 26.7606 35.245 26.8758 35.8335 26.8748ZM35.8335 27.9319C33.4488 27.9319 31.6553 28.6593 30.6072 29.6663C28.6095 28.0233 25.4508 26.8748 21.5002 26.8748C17.4402 26.8748 14.3425 28.0358 12.377 29.677C11.3092 28.6647 9.496 27.9319 7.16683 27.9319C3.24666 27.9319 0.895996 29.8848 0.895996 31.8413C0.895996 32.8178 3.24666 33.7978 7.16683 33.7978C8.249 33.7978 9.22008 33.7065 10.0747 33.5595L10.003 34.0433C10.003 35.835 14.3138 37.6266 21.5002 37.6266C28.2404 37.6266 32.9973 35.835 32.9973 34.0433L32.9615 33.5864C33.791 33.7172 34.7442 33.7978 35.8335 33.7978C39.5082 33.7978 42.1043 32.8178 42.1043 31.8413C42.1043 29.8848 39.6444 27.9319 35.8335 27.9319ZM7.16683 26.8748C8.40308 26.8748 9.52287 26.375 10.3345 25.5633C10.7504 25.1473 11.0803 24.6535 11.3053 24.11C11.5303 23.5664 11.6461 22.9839 11.646 22.3957C11.6472 21.8071 11.5321 21.2241 11.3074 20.6802C11.0828 20.1362 10.7529 19.642 10.3367 19.2258C9.92055 18.8096 9.4263 18.4797 8.88233 18.2551C8.33836 18.0304 7.75537 17.9153 7.16683 17.9165C6.57835 17.9156 5.99547 18.0308 5.45161 18.2555C4.90775 18.4803 4.41359 18.8102 3.99748 19.2263C3.58136 19.6424 3.25146 20.1366 3.0267 20.6805C2.80193 21.2243 2.68672 21.8072 2.68766 22.3957C2.68648 22.9842 2.80153 23.5672 3.02621 24.1112C3.2509 24.6551 3.58078 25.1494 3.99695 25.5656C4.41311 25.9817 4.90736 26.3116 5.45133 26.5363C5.9953 26.761 6.57829 26.876 7.16683 26.8748Z" fill="white"/>
                                </svg>
                            </button>,
                            document.body
                        )
                    }
                </>
            )}
        </>
    );
};

export const Inventory = (props:{artifact1 :Artifact, artifact2 : Artifact }) =>{
    const artifacts = [props.artifact1,props.artifact2]
    return <div className='inventory'>
            <ArtifactsList artifacts={artifacts} ></ArtifactsList>
    </div>
}
