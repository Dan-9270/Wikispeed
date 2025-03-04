import type { Player } from '../types/Player.ts';
import type { Message } from '../types/Message.ts';
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import React, { createContext, useContext } from 'react';

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
    const roomId = crypto.randomUUID();

    setTimeout(() =>{
      props.onRoomCreated(userName,roomDescription,roomId);
    },300);
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const roomId = await props.onRoomCreated(userName, roomDescription, 'random-room-id');
  //     console.log('Room created with ID:', roomId);
  //   } catch (err) {
  //     console.error('Error creating room:', err);
  //   }
  // };

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

  const handleJoinRoom = () => {
      setTimeout(() => {
          props.onRoomJoined(userName, roomId);
      }, 300); 
  };

  return (
      <div>
          <h3>Join a Room</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleJoinRoom(); }}>
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
  kind: string; // Le type du message ("send_message", "received_message", ...)
  sender: string | null; // Le nom de l'expéditeur pour un message reçu, ou null pour un message envoyé
  content: string;
  date: Date; // La date à laquelle le message a été envoyé ou reçu
}

export const ChatMessage = (props: {message: Messaged}) => {
  const { kind, sender, content, date } = props.message;
  
  const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(content).then(() => {
          alert('Message copied to clipboard!');
      }).catch((error) => {
          alert('Failed to copy message: ' + error);
      });
  };

  // Déterminer la classe CSS selon le type de message
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

const exampleMessages = [
  { kind: "send_message", sender: null, content: "Hello!", date: new Date() },
  { kind: "received_message", sender: "Alice", content: "Hi there!", date: new Date() },
  { kind: "send_message", sender: null, content: "How are you?", date: new Date() },
  { kind: "received_message", sender: "Bob", content: "I'm good, thanks!", date: new Date() }
];

export const ChatDisplayer = (props: { messages: Messaged[] }) => {
  return (
      <div className="chat-container">
          {props.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
          ))}
      </div>
  );
};

export const ChatSender = (props: { onMessageEntered: (message: string) => void }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      props.onMessageEntered(message); // Appeler la fonction pour prévenir le parent
      setMessage(''); // Réinitialiser le champ de saisie
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
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Enter your message"
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

class MockChatManager implements ChatManager {
  private socket: WebSocket | null = null;
  private messageListener: (message: Messaged) => void = () => {};

  async createRoom(userName: string, roomDescription: string): Promise<string> {
    // Exemple d'implémentation : se connecter à un serveur de chat
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket('wss://example-chat-server.com');
      
      this.socket.onopen = () => {
        // Envoyer une demande pour créer un salon
        const roomId = "new-room-id"; // Remplacez par la logique réelle
        resolve(roomId);
      };
      
      this.socket.onerror = (err) => reject(err);
    });
  }

  async joinRoom(userName: string, roomId: string): Promise<string[]> {
    if (!this.socket) throw new Error('No connection established');
    
    // Exemple de demande pour rejoindre un salon
    return new Promise((resolve, reject) => {
      this.socket!.send(JSON.stringify({ type: 'join', userName, roomId }));

      // Simuler la réception des utilisateurs dans le salon
      setTimeout(() => {
        resolve(['User1', 'User2']); // Liste simulée des utilisateurs
      }, 1000);
    });
  }

  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
    if (this.socket) {
      this.socket.onmessage = (event) => {
        const message: Messaged = JSON.parse(event.data);
        this.messageListener(message);
      };
    }
  }

  sendMessage(content: string): void {
    if (this.socket) {
      const message: Messaged = {
        kind: 'send_message',
        sender: null,
        content,
        date: new Date(),
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export const ChatManagerContext = createContext<ChatManager | undefined>(undefined);

// Hook pour accéder au ChatManager
export const useChatManager = (): ChatManager => {
  const context = useContext(ChatManagerContext);
  if (!context) {
    throw new Error('useChatManager must be used within a ChatManagerProvider');
  }
  return context;
};

export const Chatter = (props: {chatManager: ChatManager}) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Messaged[]>([]);

  const handleRoomCreated = async (userName: string, roomDescription: string, roomId: string) => {
    try {
      await props.chatManager.createRoom(userName, roomDescription);
      setRoomId(roomId);
      setUserName(userName);
    } catch (error) {
      alert('Error creating room: ' + error);
    }
  };

  const handleRoomJoined = async (userName: string, roomId: string) => {
    try {
      await props.chatManager.joinRoom(userName, roomId);
      setRoomId(roomId);
      setUserName(userName);
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

  return (
    <div>
      {!roomId ? (
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
