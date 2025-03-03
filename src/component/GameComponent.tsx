import { FaPlay } from "react-icons/fa";
import { useRedirect } from "../script/Redirection";

export const CreateGame = (props: { children?: React.ReactNode })=>{
  const redirectTo = useRedirect();

  return <div className="CreateGame" onClick={() => redirectTo("/multishare")}>
        <p> Creer une partie</p>
        {props.children}
    </div>
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
export const PlayGame =(props:{link : string}) =>{
  const redirectTo = useRedirect();
  return         <button onClick={()=> redirectTo(`/${props.link}`)}
  className="button">Demarrer<FaPlay></FaPlay> </button>
  
}

  export const Setting = () =>{
    return <div className="setting">
            <p>Setting</p>
    </div>
  }
