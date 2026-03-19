import { useState } from "react";
import ReactDOM from "react-dom";
import damien from "../assets/avatar/Avatar_Damien.svg";
import benjamin from "../assets/avatar/Avatar_Benjamin.svg";
import pommier from "../assets/avatar/Avatar_Pommier.svg";
import titouan from "../assets/avatar/Avatar_Titouan.svg";
import daniel from "../assets/avatar/Avatar_Daniel.svg";
import neuille from "../assets/avatar/Avatar_Neuille.svg";
import cornu from "../assets/avatar/Avatar_Cornu.svg";

const avatars = [damien, benjamin, pommier, titouan, daniel, neuille, cornu];

export const AvatarSelector = (props: { avatar:string , onAvatarChange: (newAvatar: string) => void }) => {
    const [avatar, setAvatar] = useState(damien);  // Utilise la prop avatar comme valeur initiale
    const [isOpen, setIsOpen] = useState(false);
  
    const handleChangeImg = (newAvatar: string) => {
        setAvatar(newAvatar);  // Met à jour l'état local de l'avatar
        props.onAvatarChange(newAvatar);  // Appelle la fonction onAvatarChange du parent pour transmettre l'avatar sélectionné
    };

    return (
        <>
            <div className="profilePicture">
                <img
                    src={avatar}
                    alt="Avatar"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ cursor: "pointer" }}
                />
            </div>
            {isOpen && 
                ReactDOM.createPortal(
                    <div className="avatar-portal">
                        <h2>Choisissez un avatar</h2>
                        <ul>
                            {avatars.map((avatarOption) => (
                                <li key={avatarOption} onClick={() => handleChangeImg(avatarOption)}>
                                    <img src={avatarOption} alt="avatar" />
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setIsOpen(false)}>Fermer</button>
                    </div>,
                    document.body
                )}
        </>
    );
};
