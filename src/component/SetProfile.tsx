import {AvatarSelector} from "./AvatarSelector.tsx";
export const SetProfile = (props:{username?:string}) =>{
    return <div className='setProfile manjari'>
        <AvatarSelector/>
        <input type="text" id="inputBox" placeholder="Username" className="manjari" value={props.username}></input>
      </div>
} 
