import { v4 as uuidv4 } from 'uuid';
import { ChatManager,Messaged, RealChatManager } from "./Chat";

export class RealWebSocketChatManager implements RealChatManager {
  private socket: WebSocket | null = null;
  private messageListener: (message: Messaged) => void = () => {};
  private playersListener: (players: string[]) => void = () => {};
  private roomCreatedListener: (roomId: string) => void = () => {};
  private currentRoomId: string | null = null;

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.socket = new WebSocket('ws://localhost:2025/');

      this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
        resolve();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message reçu:", data);
        
        if (data.kind === 'players_list') {
          console.log("🔄 Mise à jour de la liste des joueurs reçue:", data.users);
          this.playersListener(data.users || []);
        } else if (data.kind === 'message_received' || data.kind === 'message_send') {
          const message: Messaged = {
            kind: data.kind,
            sender: data.sender || null,  
            content: data.content,
            date: new Date(),
          };
          this.messageListener(message);
        } else if (data.kind === 'room_created') {
          this.currentRoomId = data.room_id;
          this.roomCreatedListener(data.room_id);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };
    });
  }

  async createRoom(userName: string): Promise<string> {
    await this.connect();
  
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not initialized");
    }

    const roomId = crypto.randomUUID();
    const message = JSON.stringify({
      kind: "create_room",
      user_name: userName,
      roomID: roomId
    });

    this.socket.send(message);
    console.log("Room creation message sent:", message);
    return roomId;
  }

  async joinRoom(userName: string, roomId: string): Promise<string[]> {
    await this.connect();
  
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not initialized");
    }

    const message = JSON.stringify({
      kind: "join_room",
      user_name: userName,
      room_id: roomId,
    });
    
    this.socket.send(message);
    console.log("Join room message sent:", message);
    return [];
  }

  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
  }

  setPlayersListener(listener: (players: string[]) => void): void {
    this.playersListener = listener;
  }

  setRoomCreatedListener(listener: (roomId: string) => void): void {
    this.roomCreatedListener = listener;
  }

  sendMessage(content: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        kind: "send_message",
        content: content,
      });
      this.socket.send(message);
    } else {
      console.error("WebSocket is not open");
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
