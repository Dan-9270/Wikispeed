import {AvatarSelector} from "./AvatarSelector.tsx";
import React from 'react';

export const SetProfile = (props: { username?: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className='setProfile manjari'>
      <AvatarSelector />
      <input 
        type="text" 
        id="inputBox" 
        placeholder="Username" 
        className="manjari" 
        value={props.username} 
        onChange={props.onChange} 
      />
    </div>
  );
};
