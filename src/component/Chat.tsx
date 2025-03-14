import type { Player } from '../types/Player.ts';
import type { Message } from '../types/Message.ts';
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import React, { createContext, useContext } from 'react';
import { SoundPlayer } from './MusicComponent.tsx';
import { useRedirect } from '../script/Redirection.ts';
import Damien from "../assets/avatar/Avatar_damien.svg";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import hover from '../assets/music/hover.mp3';
import click from '../assets/music/click.mp3';

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

export const RoomCreator = (props : {
  initialUserName : string,
  initialRoomDescription : string,
  onRoomCreated : (userName : string, roomDescription : string , roomIdentifier : string) => void }) =>{

  const [userName, setUserName] = useState(props.initialUserName);
  const [roomDescription, setRoomDescription] = useState(props.initialRoomDescription);

  const newCreateRoom = () => {

    const roomId = uuidv4();

    console.log(roomId);
    setTimeout(() =>{
      props.onRoomCreated(userName,roomDescription,roomId);
    },300);
  }


  return (
    <form onSubmit={(e) => {e.preventDefault(); newCreateRoom();}}>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <input
        type="text"
        value={roomDescription}
        onChange={(e) => setRoomDescription(e.target.value)}
        placeholder="Room Description"
      />
      <button type="submit">Create Room</button>
    </form>
  );
};

export const RoomJoiner = (props: {initialUserName: string, initialRoomId: string, onRoomJoined: (userName: string, roomId: string) => void}) => {
  const [userName, setUserName] = useState(props.initialUserName);
  const [roomId, setRoomId] = useState(props.initialRoomId);

  const joinRoom = () => {
      setTimeout(() => {
          props.onRoomJoined(userName, roomId);
          console.log(roomId);
      }, 300); 
  };

  return (
      <div>
          <h3>Join a Room</h3>
          <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }}>
              <label>
                  User Name:
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </label>
              <br />
              <label>
                  Room ID:
                  <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
              </label>
              <br />
              <button type="submit">Join Room</button>
          </form>
      </div>
  );
};

export interface Messaged  {
  kind: string; 
  photo : string 
  sender: string | null; 
  content: string;
  date: Date;}

export const ChatMessage = (props: {message: Messaged}) => {
  const { kind, sender, content, date } = props.message;
  
  const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(content).then(() => {
          alert('Message copied to clipboard!');
      }).catch((error) => {
          alert('Failed to copy message: ' + error);
      });
  };

  const messageClass = kind === "send_message" ? "sent-message" : "received-message";

  return (
      <div className={`chat-message ${messageClass}`}>
          {kind === "received_message" && sender && <strong>{sender}: </strong>}
          <span>{content}</span>
          <span className="message-time">{date.toLocaleDateString()}</span>
          <button onClick={handleCopyToClipboard}>Copy</button>
      </div>
  );
};

export const ChatDisplayer = (props: { messages: Messaged[] }) => {
  return (
      <div className="chat-container">
          {props.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
          ))}
      </div>
  );
};

/***************Bon ***************/

export const ChatSender = (props: { onMessageEntered: (message: string) => void }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      props.onMessageEntered(message); 
      setMessage(''); 
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <input
        type="text" value={message} onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress} placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export interface ChatManager {
  createRoom(userName: string, roomDescription: string): Promise<string>;

  joinRoom(userName: string, roomId: string): Promise<string[]>;

  setMessageListener(listener: (message: Messaged) => void): void;

  sendMessage(content: string): void;

  close(): void;
}

export const Chatter = (props: {chatManager: ChatManager}) => {
  const [isRoom,setIsRoom] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Messaged[]>([]);

  const handleRoomCreated = async (userName: string, roomDescription: string, roomId: string) => {
    try {
      await props.chatManager.createRoom(userName, roomDescription);
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
      console.log(isRoom);
    } catch (error) {
      alert('Error creating room: ' + error);
    }
  };

  const handleRoomJoined = async (userName: string, roomId: string) => {
    try {
      console.log("Joining room..."); // Ajoutez ce log
      await props.chatManager.joinRoom(userName, roomId);
      console.log("Room joined successfully"); // Ajoutez ce log
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
    } catch (error) {
      alert('Error joining room: ' + error);
    }
  };

  const handleMessageEntered = (message: string) => {
    props.chatManager.sendMessage(message);
  };

  const handleMessageReceived = (message: Messaged) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    props.chatManager.setMessageListener(handleMessageReceived);
  }, [props.chatManager]);

  useEffect(() => {
    console.log("isRoom updated:", isRoom);
  }, [isRoom]);
  return (
    
    <div>
      
      {!isRoom ? (
        <>
          <RoomCreator initialUserName="User" initialRoomDescription="Chat Room" onRoomCreated={handleRoomCreated} />
          <RoomJoiner initialUserName="User" initialRoomId="" onRoomJoined={handleRoomJoined} />
        </>
      ) : (
        <>
          <ChatDisplayer messages={messages} />
          <ChatSender onMessageEntered={handleMessageEntered} />
        </>
      )}
    </div>
  );
};


export const CreateGame = (props: { initalUserName : string ,photo:string,children?: React.ReactNode,onRoomCreated : (userName : string , roomIdentifier : string,photo:string) => void }) => {
  const [userName, setUserName] = useState(props.initalUserName);
  const [avatar, setAvatar] = useState(props.photo);
 
  const navigate = useNavigate(); 
  const newCreateRoom = () => {
    const roomId = uuidv4();
    console.log(roomId);
    setTimeout(() =>{
      props.onRoomCreated(userName,roomId,props.photo);
      navigate('../multishare', { state: { userName,avatar }});


    },300);
  }

 




  return (
    <SoundPlayer hoverSound={hover} clickSound={click} volume={0.1}>
     <div className="CreateGame"   onClick={() => {
                  newCreateRoom();


                }}     >




       <p>Creer une partie</p>
        {props.children}
        </div>
    </SoundPlayer>
  );
}

export const JoinGame = (props: {initialUserName:string, photo:string,initialRoomId:string,children?: React.ReactNode,onRoomJoined:(userName:string,roomId:string,photo:string) =>void }) => {
  const [userName, setUserName] = useState(props.initialUserName);
  const [roomId, setRoomId] = useState(props.initialRoomId);
  const [avatar, setAvatar] = useState(props.photo);

  const redirectTo = useRedirect();
  const navigate = useNavigate(); 


  const joinRoom = () => {
    setTimeout(() => {
        props.onRoomJoined(userName, roomId,props.photo);
        console.log(roomId);
        navigate('../multishare', { state: { userName,avatar }});
    }, 300); 
};

  return (
      <form className='JoinGame' onSubmit={(e) => { e.preventDefault(); joinRoom(); }} >
          <p>Rejoindre une partie</p>
          <input type='text' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Entrez le code de la partie'/>
          {props.children}
      </form>
  );

}


const RealMessage=(props:{message:Messaged, avatar?: string})=>{
  const { kind, sender, content, date } = props.message;

  const messageClass = kind === "send_message" ? "sendMessage" : "message";
  console.log(props.avatar);
  return <div className={messageClass}>
          <div className="messagebox_chat">
            <div className="avatar"><img src={props.avatar} alt="img"/>
            </div><div className="content"><div className="name">{sender}</div>
            <div className="text">{content}</div></div></div></div>
}

export const RealChatSender = (props: { onMessageEntered: (message: string) => void }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      props.onMessageEntered(message); 
      setMessage(''); 
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <input
        type="text" value={message} onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress} placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};
export const RealChatBox = (props: {messages: Array<Messaged>, handleMessageEntered:(Message:string)=>void, avatar?: string}) => {

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
                          return <RealMessage key={i} message={message} avatar={message.photo} />
                      })}
                  </div>
                  <RealChatSender onMessageEntered={props.handleMessageEntered}></RealChatSender>
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




export interface RealChatManager {
  createRoom(userName: string): Promise<string>;

  joinRoom(userName: string, roomId: string): Promise<string[]>;

  setMessageListener(listener: (message: Messaged) => void): void;

  setPlayersListener(listener: (players: string[]) => void): void;

  sendMessage(content: string, photo: string): void;

  close(): void;
}


export const RealChatter = (props: {name:string,photo:string,chatManager: RealChatManager }) => {
  const [isRoom,setIsRoom] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Messaged[]>([]);

  const handleRoomCreated = async (userName: string, roomId: string) => {
    try {
      console.log("ddd")
      await props.chatManager.createRoom(userName);
      console.log("eeeeeeeeeeee")
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
      console.log(isRoom);
      console
    } catch (error) {
      alert('Error creating room: ' + error);
    }
  };

  const handleRoomJoined = async (userName: string, roomId: string) => {
    try {
      console.log("Joining room..."); // Ajoutez ce log
      await props.chatManager.joinRoom(userName, roomId);
      console.log("Room joined successfully"); // Ajoutez ce log
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
    } catch (error) {
      alert('Error joining room: ' + error);
    }
  };

  const handleMessageEntered = (message: string) => {
    props.chatManager.sendMessage(message,props.photo);
  };

  const handleMessageReceived = (message: Messaged) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    props.chatManager.setMessageListener(handleMessageReceived);
  }, [props.chatManager]);

  useEffect(() => {
    console.log("isRoom updated:", isRoom);
  }, [isRoom]);
  return (
    
    <div>
      
      {!isRoom ? (
        <>
          <CreateGame initalUserName={props.name} photo={props.photo} onRoomCreated={handleRoomCreated} />
          <JoinGame initialUserName={props.name} photo={props.photo} initialRoomId="" onRoomJoined={handleRoomJoined} />
        </>
      ) : (
        <>
          <RealChatBox messages={messages} handleMessageEntered={handleMessageEntered} avatar={props.photo} />
        </>
      )}
    </div>
  );
};


export const FinChatter = (props: {chatManager: RealChatManager, initialUserName?: string, avatar: string}) => {
  const [isRoom,setIsRoom] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(props.initialUserName || null);
  const [messages, setMessages] = useState<Messaged[]>([]);

  const handleRoomCreated = async (userName: string, roomId: string) => {
    try {
      console.log("ddd")
      await props.chatManager.createRoom(userName);
      console.log("eeeeeeeeeeee")
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
      console.log(isRoom);
      console
    } catch (error) {
      alert('Error creating room: ' + error);
    }
  };

  const handleRoomJoined = async (userName: string, roomId: string) => {
    try {
      console.log("Joining room..."); // Ajoutez ce log
      await props.chatManager.joinRoom(userName, roomId);
      console.log("Room joined successfully"); // Ajoutez ce log
      setRoomId(roomId);
      setUserName(userName);
      setIsRoom(true)
    } catch (error) {
      alert('Error joining room: ' + error);
    }
  };

  const handleMessageEntered = (message: string) => {
    console.log("Je suis la photo" + props.avatar);
    props.chatManager.sendMessage(message,props.avatar);
  };

  const handleMessageReceived = (message: Messaged) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    props.chatManager.setMessageListener(handleMessageReceived);
  }, [props.chatManager]);

  useEffect(() => {
    console.log("isRoom updated:", isRoom);
  }, [isRoom]);
  return (
    
    <div>

        <>
          <RealChatBox messages={messages} handleMessageEntered={handleMessageEntered} avatar={props.avatar} />
        </>
    </div>
  );
};