import { FaPlay } from "react-icons/fa";
import { useRedirect } from "../script/Redirection"
import { SoundPlayer } from './MusicComponent'

import hover from '../assets/music/hover.mp3';
import click from '../assets/music/click.mp3';
import { useEffect } from "react";

export const CreateGame = (props: { children?: React.ReactNode }) => {
    const redirectTo = useRedirect()

    return (
        <SoundPlayer hoverSound={hover} clickSound={click} volume={0.1}>
            <div className="CreateGame" onClick={() => redirectTo("/multishare")}>
                <p>Creer une partie</p>
                {props.children}
            </div>
        </SoundPlayer>
    )
}

  export const JoinGame = (props: { children?: React.ReactNode }) => {
    return (
        <div className='JoinGame'>
            <p>Rejoindre une partie</p>
            <input type='text' placeholder='Entrez le code de la partie'/>
            {props.children}
        </div>
    );
}

// Composant PlayGame modifié

export const PlayGame = (props: { link: string; onClick: (event: React.FormEvent) => void , username :string , owner :string}) => {
  return (
    (props.owner == props.username) &&
    <div
      onClick={props.onClick}  // Appelle la fonction avec l'événement
      className="button"
    >
      Démarrer <FaPlay />
    </div>
  );
};


export const Loading = (props: { onChangeGameState: (state: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onChangeGameState("game");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [props.onChangeGameState]);

  return (
    <div>
      LOADING ...
    </div>
  );
};


  export const Setting = () =>{
    return <div className="setting">
            <p>Setting</p>
    </div>
  }

  