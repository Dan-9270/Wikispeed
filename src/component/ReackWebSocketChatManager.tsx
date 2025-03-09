import { v4 as uuidv4 } from 'uuid';
import { ChatManager,Messaged, RealChatManager } from "./Chat";

export class RealWebSocketChatManager implements RealChatManager {
  private socket: WebSocket | null = null;
  private messageListener: (message: Messaged) => void = () => {};

  private connect(): void {
    if (this.socket !== null) {
      this.socket.close();
    }

    this.socket = new WebSocket('ws://localhost:2025/');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };


    this.socket.onmessage = (event) => {
      const message: Messaged = {
        kind: 'received_message',
        sender: null,  
        content: event.data as string,
        date: new Date(),
      };
      this.messageListener(message);
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
  
        const roomId = uuidv4();
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
        this.socket?.send(message);
        resolve(["",""])
      };})


    
  }

  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
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
