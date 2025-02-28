import type { Player } from '../types/Player.ts';
import type { Message } from '../types/Message.ts';
import {useState} from "react";
import {createPortal} from "react-dom";

export const ChatBox = (props: { player: Player, messages: Array<Message> }) => {

    const [visibility, showchat] = useState(false);
    console.log("visibility:" + visibility);

    return <>
        {visibility ?
            createPortal(
                <div className={`manjari chatBox ${visibility ? 'visible' : ''}`}>
                    <h1>Chat</h1>
                    <button className="closebutton manjari" onClick={() => showchat(false)}>x</button>
                    <div className="messageArea">
                        {props.messages.map((message, i) => {
                            return <Message key={i} reader={props.player} sender={message.player} text={message.text} />
                        })}
                    </div>
                    <input className="manjari" type="text" placeholder="Send a message" />
                </div>,
                document.body
            )
            :
            createPortal(
                <button className="chatbutton" onClick={() => showchat(true)}>
                    {/* SVG du bouton */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25001 12C1.25001 6.063 6.06301 1.25 12 1.25C17.937 1.25 22.75 6.063 22.75 12C22.75 17.937 17.937 22.75 12 22.75C10.144 22.75 8.39501 22.279 6.87001 21.45L2.63701 22.237C2.51739 22.2591 2.39418 22.2519 2.278 22.2158C2.16183 22.1797 2.05617 22.1159 1.97015 22.0299C1.88413 21.9438 1.82032 21.8382 1.78424 21.722C1.74815 21.6058 1.74087 21.4826 1.76301 21.363L2.55101 17.13C1.69462 15.5559 1.24727 13.792 1.25001 12Z" fill="white"/>
                    </svg>
                </button>,
                document.body
            )
        }
    </>
}

const Message=(props:{reader:Player,sender:Player,text:string})=>{
    const messageClass = props.sender.id === props.reader.id ? "sendMessage" : "message";
    return <div className={messageClass}><div className="messagebox_chat"><div className="avatar"><img src={props.sender.avatar} alt={props.sender.name}/></div><div className="content"><div className="name">{props.sender.name}</div><div className="text">{props.text}</div></div></div></div>
}