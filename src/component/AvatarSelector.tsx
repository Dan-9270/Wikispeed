import { useState } from "react";
import ReactDOM from "react-dom";
import damien from "../assets/avatar/Avatar_damien.svg";
import benjamin from "../assets/avatar/Avatar_Benjamin.svg"

const avatars=[damien,benjamin];

export const AvatarSelector = () => {
    const [avatar, setAvatar] = useState(damien);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <><div className="profilePicture">
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
                        {avatars.map((avatar) => {
                            return <li onClick={()=>setAvatar(avatar)}><img src={avatar} alt="avatar" /></li>
                        })}
                        </ul>
                        <button onClick={() => setIsOpen(false)}>Fermer</button>
                    </div>,
                    document.body
                )}
        </>
    );
};