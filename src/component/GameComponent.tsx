import { FaPlay } from "react-icons/fa";
import { useRedirect } from "../script/Redirection"
import { SoundPlayer } from './MusicComponent'

import hover from '../assets/music/hover.mp3';
import click from '../assets/music/click.mp3';
import { useEffect, useState } from "react";
import { Game } from "../Game";

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


export const Loading = (props: { game: Game; onChange: (newGame: Game) => void; onChangeGameState: (state: string) => void }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const fetchRandomArticles = async () => {
      if (!props.game.settings.randomMots || props.game.settings.nombreArticles <= 0) {
        timer = setTimeout(() => props.onChangeGameState("game"), 2000);
        return;
      }

      const newGame = { ...props.game };
      const articles = [];

      for (let i = 0; i < props.game.settings.nombreArticles; i++) {
        try {
          const response = await fetch("https://fr.wikipedia.org/api/rest_v1/page/random/summary");
          const data = await response.json();
          if (data?.title) articles.push(data.title);
        } catch (error) {
          console.error("Erreur lors de la récupération d'un article Wikipedia:", error);
          articles.push(`Article ${i + 1}`);
        }
      }

      newGame.settings.wordsList = articles;
      props.onChange(newGame);
      timer = setTimeout(() => props.onChangeGameState("game"), 1000);
    };

    fetchRandomArticles();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [props.game.settings.randomMots, props.game.settings.nombreArticles, props.onChange, props.onChangeGameState]);

  return <div className="loading-container">LOADING</div>;
};

  export const Setting = () =>{
    return <div className="setting">
            <p>Setting</p>
    </div>
  }

  