import { ChatManager,Messaged } from "./Chat";

export class WebSocketChatManager implements ChatManager {
  private socket: WebSocket | null = null;
  private messageListener: (message: Messaged) => void = () => {};

  // Se connecter au serveur WebSocket
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
        sender: null,  // Vous pouvez ajouter un identifiant ou nom d'utilisateur si nécessaire.
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

  // Créer un salon (le serveur va simplement accepter la connexion)
  async createRoom(userName: string, roomDescription: string): Promise<string> {
    this.connect();
    const roomId = crypto.randomUUID();  // Génère un identifiant unique pour le salon
    return roomId;
  }

  // Rejoindre un salon (connecte également à WebSocket)
  async joinRoom(userName: string, roomId: string): Promise<string[]> {
    this.connect();
    return ['User1', 'User2'];  // Liste fictive des utilisateurs
  }

  // Enregistrer un listener pour les messages
  setMessageListener(listener: (message: Messaged) => void): void {
    this.messageListener = listener;
  }

  // Envoyer un message au serveur WebSocket
  sendMessage(content: string): void {
    if (this.socket) {
      this.socket.send(content);
    }
  }

  // Fermer la connexion WebSocket
  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
