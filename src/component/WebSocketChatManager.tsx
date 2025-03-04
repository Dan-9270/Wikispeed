import { ChatManager,Messaged } from "./Chat";

export class WebSocketChatManager implements ChatManager {
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

  async createRoom(userName: string, roomDescription: string): Promise<string> {
    this.connect();
    const roomId = crypto.randomUUID(); 
    return roomId;
  }

  async joinRoom(userName: string, roomId: string): Promise<string[]> {
    this.connect();
    return ['User1', 'User2'];  
  }

  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
  }

  sendMessage(content: string): void {
    if (this.socket) {
      this.socket.send(content);
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
