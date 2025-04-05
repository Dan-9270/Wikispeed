import { useState } from "react";
import { createPortal } from "react-dom";

export interface Artifact{
    name: string
    description: string
    img: string
    onActivate?: () => void
}

interface ArtifactPopupProps {
    artifactName: string;
    artifactImage: string;
    message: string;
    onClose: () => void;
}

export const ArtifactPopup = ({ artifactName, artifactImage, message, onClose }: ArtifactPopupProps) => {
    return (
        <div className="artifact-popup-overlay" onClick={onClose}>
            <div className="artifact-popup-message" onClick={(e) => e.stopPropagation()}>
                <img src={artifactImage} alt={artifactName} className="artifact-popup-icon" />
                <h2 className="manjari">{artifactName} a été activé !</h2>
                <p className="manjari">{message}</p>
            </div>
            <div className="artifact-popup-backdrop" />
        </div>
    );
};

export const Artifacts = (props:{artifact:Artifact}) =>{
    const [description, setDescription] = useState(false);

    const handleActivate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (props.artifact.onActivate) {
            props.artifact.onActivate();
        setDescription(false);
    };
}

    return (
        <>
            <div className='artifact-border' onClick={() => setDescription(true)}>
                {description && createPortal(
                    <div className="artifact-description manjari" onClick={() => setDescription(false)}> 
                        <div className="artifact-border">
                            <figure> <img src={props.artifact.img} alt={props.artifact.name} /></figure>
                        </div>
                        <div className="title-description"> {props.artifact.name}</div>
                        <p>{props.artifact.description}</p>
                        <div className="artifact-active" onClick={handleActivate}> 
                            <span className="manjari">ACTIVER</span> 
                        </div>
                    </div>,
                    document.body
                )}
                <figure> <img src={props.artifact.img} alt={props.artifact.name} /></figure>
                {description && createPortal(
                    <div onClick={(e) => { 
                        e.stopPropagation(); 
                        setDescription(false); 
                    }} className="blur"></div>,
                    document.body
                )}
            </div>
        </>
    );
}



