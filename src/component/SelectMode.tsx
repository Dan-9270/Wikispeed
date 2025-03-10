import { useRedirect } from "../script/Redirection";
import { FaPlay } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';

export const SelectMode = (props: { title: string, img: string, link: string, onClick?: () => void }) => {
    const navigate = useNavigate(); 
    const handleClick = () => {
        navigate(`/${props.link}`); 
        if (props.onClick) {
            props.onClick(); 
        }
    };
    return (
        <div className='select-mode' onClick={handleClick}>
            <img className="select-img" src={props.img} alt={props.title} />
            <div className='mode'>
                <h2 className="manjari">{props.title}</h2>
            </div>
        </div>
    );
};


export const NextHome = (props :{title : string , link : string}) =>{   
    const redirectTo = useRedirect();

    return <div className='button' onClick={() => redirectTo(`/${props.link}`)}>
                    <h2 className="manjari">{props.title}</h2>
                    <FaPlay/>   
            </div>


}