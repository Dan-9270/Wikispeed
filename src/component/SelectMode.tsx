import { useRedirect } from "../script/Redirection";
import { FaPlay } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';


export const SelectMode = (props: { title: string, img: string, link: string, onClick?: () => void, isInputValid: boolean }) => {
    const navigate = useNavigate();

    // Fonction de gestion du clic
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!props.isInputValid) {
            alert('Veuillez remplir le champ utilisateur.');
            event.preventDefault();  // Empêche la navigation si l'input est invalide
            return;  // Stoppe l'exécution et empêche la navigation
        }

        // Si l'input est valide, continuer la navigation
        navigate(`/${props.link}`); 

        // Exécuter l'event handler externe s'il existe
        if (props.onClick) {
            props.onClick(); 
        }
    };

    return (
        <div className='select-mode' >
            <img 
                className="select-img" 
                src={props.img} 
                alt={props.title} 
                onClick={handleClick} 
            />
            <div className='mode'>
                <h2 className="manjari">{props.title}</h2>
            </div>
        </div>
    );
};




export const NextHome = (props :{title : string, onClick:()=>void}) =>{   
   

    return <div className='button' onClick={() => props.onClick()}>
                    <h2 className="manjari">{props.title}</h2>
                    <FaPlay/>   
            </div>


}