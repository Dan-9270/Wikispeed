import { v4 as uuidv4 } from 'uuid';
import { ChatManager,Messaged, RealChatManager } from "./Chat";
import { Player } from '../types/Player';
import { wsUrl } from '../config/endpoints';

export class RealWebSocketChatManager implements RealChatManager {
  private socket: WebSocket | null = null;
  private messageListener: (message: Messaged) => void = () => {};
  private playersListener: (players: string[]) => void = () => {};
  private isGameListener: (isGame: boolean) => void = () => {};


  private playersInformation: (players: Player[]) => void = () => {};
  private endListener: (isGame: boolean) => void = () => {};
  private parametersListener: (parameters:  Object) => void = () => {};
  private mineListener: (mine: Map<number,string[][]>) => void = () => {};
  private roomID :string = '';


  private connect(): void {
    if (this.socket !== null) {
      this.socket.close();
    }

    this.socket = new WebSocket(wsUrl());

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.kind === 'room_joined' || data.kind === 'user_joined' || data.kind === 'user_left' || data.kind === 'room_created' ) {
        this.playersListener(data.users || []);
      }else if (data.kind === 'start-game') {
       // console.log("start-game", data.isPlay);
        this.isGameListener(data.isPlay);
      }else if(data.kind === "player-finished"){
       // console.log("player-finished", data.players);
        this.playersInformation(data.players);
      }else if(data.kind === "mine"){
         console.log("minedeeddeeded", data.mined);
         console.log("mineaaaaaaaaaa", data.id);
          this.mineListener(data.mined);
      }
        
        else if(data.kind === 'finish-game'){
       // console.log("finish-game", data.end);
        this.endListener(data.end);}
      else if (data.kind === 'parameters-for-game') {
       // console.log("parameters-for-game", data.parameters);
        this.parametersListener(data.parameters);
      }
      else {
        const message_kind = data.kind;
        const message: Messaged = {
          kind: message_kind,
          photo: data.photo || null,
          sender: data.sender || null,  
          content: data.content || event.data,
          date: new Date(),
        };
        this.messageListener(message);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  async createRoom(userName: string): Promise<string> {
    this.connect();
  
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket is not initialized"));
        return;
      }
  
      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
  
        const roomId = crypto.randomUUID();
        this.roomID = roomId;
        const message = JSON.stringify({
          kind: "create_room",
          user_name: userName,
          roomID : roomId
        });
  
        this.socket?.send(message);
  
        resolve(roomId);
      };
  
      this.socket.onerror = (error) => {
        reject(new Error("WebSocket error: " + error));
      };
    });
  }
  public getRoomId() : string{
    return this.roomID;
  }
  async joinRoom(userName: string, roomId: string): Promise<string[]> {
    this.connect();
  
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket is not initialized"));
        return;
      }
  
      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
  
        const message = JSON.stringify({
          kind: "join_room",
          user_name: userName,
          room_id: roomId,
        });
        this.roomID = roomId
        this.socket?.send(message);
        resolve(["",""])
      };
    });
  }
  
  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
  }

  setPlayersListener(listener: (players: string[]) => void): void {
    this.playersListener = listener;
  }

  setIsGameListener(listener: (isGame: boolean) => void): void {
    this.isGameListener = listener;
  }

  setIsEndListener(listener: (isGame: boolean) => void): void {
    this.endListener = listener;
  }

  setParametersListener(listener: (parameters: Object) => void): void {
    this.parametersListener = listener;
  }

  setPlayersInfoListener(listener: (players: Player[]) => void): void {
    this.playersInformation = listener;
  }
  setMineListener(listener: (mine: Map<number,string[][]>) => void): void {
    this.mineListener = listener;
  }

  sendMessage(content: string, photo: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        kind: "send_message",
        content: content,
        photo: photo,
      });
      this.socket.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  }
  sendGameStart(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        kind: "start_game",
      });
      this.socket.send(message);
  }
}

sendFinishGame(): void {
  if (this.socket && this.socket.readyState === WebSocket.OPEN) {
   // console.log("sendFinishGame");
    const message = JSON.stringify({
      kind: "finish_game",
    });
    this.socket.send(message);
  }
}
async sendParameters(parameters: any): Promise<void> {
  if (this.socket && this.socket.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      kind: "parameters",
      parameters: parameters,
    });
    this.socket.send(message);
  }
}

async sendPlayer(player: Player): Promise<void> {
  if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//    console.log("sendPlayer", player);

    const message = JSON.stringify({
      kind: "player_at_the_end",
      players: player,
      articles: Array.from(player.articles.entries()), // <-- ici
    });
    this.socket.send(message);
  }
}

async sendMine(id:number,mine: string[][]): Promise<void> {
  if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//    console.log("sendPlayer", player);

    const message = JSON.stringify({
      kind: "mine",
      id: id,
      mined: mine, // <-- ici
    });
    this.socket.send(message);
  }
}


  close(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        kind: "disconnect",
      });
      this.socket.send(message);
  
      this.socket.close();
    }
  }
}