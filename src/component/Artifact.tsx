import { useState } from "react";
import { createPortal } from "react-dom";

export interface Artifact{
    name:string
    description:string
img:string  }

export const Artifacts = (props:{artifact:Artifact}) =>{
    const [description, setDescription] = useState(false);
    console.log("description:" + description);

    return <div className='artifact-border' onClick={ () =>{setDescription(true) }}>
        {description && createPortal(<div className="artifact-description manjari" onClick={()=>setDescription(false)}> 
        <div className="artifact-border">
                        <figure> <img src={props.artifact.img} alt={props.artifact.name} /></figure>
                    </div>
                    <div className="title-description"> {props.artifact.name}</div>
                    <p>          {props.artifact.description}</p>
                    <div className="artifact-active" onClick={ (e) =>{ e.stopPropagation(); setDescription(false)} }> <span className="manjari">ACTIVER</span> </div>
             </div>
             ,document.body)}
                <figure> <img src={props.artifact.img} alt={props.artifact.name} /></figure>
                       {description && createPortal(
                <div onClick={(e) => { 
                    e.stopPropagation(); 
                    setDescription(false); 
                }} className="blur"></div>,
                document.body
            )}
      </div>
}


