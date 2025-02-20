export const SetProfile = (props:{image?:string,username?:string}) =>{
    return <div className='setProfile manjari'>
        <div className="profilePicture"><img src={props.image}/></div>
        <input type="text" placeholder="Username" className="manjari" value={props.username}></input>
      </div>
} 
