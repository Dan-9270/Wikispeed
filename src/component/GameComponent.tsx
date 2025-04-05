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

 
// Définition du composant AutoCompleteInput avec ses props
export const AutoCompleteInput = (props: {
  value: string;  // Valeur actuelle de l'input
  onChange: (newValue: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Gestion des événements clavier
}) => {
  // État pour stocker les suggestions de complétion
  const [completions, setCompletions] = useState<string[]>([]);
  // État pour indiquer si les suggestions sont en cours de chargement
  const [loading, setLoading] = useState<boolean>(false);

  // Fonction qui récupère les suggestions depuis l'API Wikipédia
  const fetchCompletions = async (query: string) => {
      if (!query) {
          setCompletions([]);
          return;
      }
      setLoading(true);
      try {
          const response = await fetch(`https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${encodeURIComponent(query)}`);
          const data = await response.json();
          setCompletions((data[1] || [])); // Limite la liste des suggestions à 4 mots
      } catch (error) {
          console.error("Erreur lors de la récupération des complétions:", error);
      }
      setLoading(false);
  };

  // Effet qui s'exécute à chaque changement de la valeur d'entrée
  useEffect(() => {
      const timeoutId = setTimeout(() => fetchCompletions(props.value), 300); // Déclenche après un délai pour limiter les requêtes
      return () => clearTimeout(timeoutId);
  }, [props.value]);

  // Fonction de gestion des touches du clavier
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !completions.includes(props.value)) {
          event.preventDefault(); // Bloque la touche Entrée si la valeur n'est pas dans la liste des suggestions
      } else {
          props.onKeyDown(event);
      }
  };

  // Fonction pour mettre la première lettre en majuscule
  const capitalizeFirstLetter = (text: string) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
      <div>
          {/* Champ de saisie */}
          <input
            id="word"
              onKeyDown={handleKeyDown}
              className="words td-phone input-phone"
              type="text"
              value={props.value}  // Valeur de l'input
              onChange={(e) => props.onChange(capitalizeFirstLetter(e.target.value))}  // Met à jour la valeur avec une majuscule
              placeholder="Entrez vos articles"  // Texte indicatif
              list="autocomplete-list"
          />
          
          {/* Liste de suggestions sous forme de datalist */}
          <datalist id="autocomplete-list">
              {completions.map((completion, index) => (
                  <option key={index} value={completion} />
              ))}
          </datalist>

          {/* Affichage du message de chargement si les suggestions sont en train de se charger */}
          {loading && <p>Chargement...</p>}
      </div>
  );
};