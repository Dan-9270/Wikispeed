import WebSocket from 'ws';

export interface Room {
  id: string;
  members: Map<string, WebSocket>; // usernames linked to their websocket
}

let rooms = new Map<string, Room>();

const wss = new WebSocket.Server({ port: 2025 });

// Fonction utilitaire pour envoyer la liste des joueurs à tous les membres d'une room
function broadcastPlayersList(room: Room) {
  const playersList = Array.from(room.members.keys());
  console.log("Broadcasting players list:", playersList);
  room.members.forEach((ws) => {
    ws.send(JSON.stringify({
      kind: 'players_list',
      users: playersList
    }));
  });
}

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  let currentRoom: Room | null = null;
  let currentUser: string | null = null;

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      const roomId = data.roomID;
      console.log("Message reçu:", data);
      
      switch (data.kind) {
        case 'create_room':
          const room: Room = {
            id: roomId,
            members: new Map(),
          };
          rooms.set(roomId, room);
          console.log("je suis la room id ",roomId)
          currentRoom = room;
          currentUser = data.user_name;
          room.members.set(data.user_name, ws);
          
          // Envoyer la confirmation de création de room
          ws.send(JSON.stringify({ 
            kind: 'room_created', 
            room_id: roomId 
          }));
          
          // Envoyer immédiatement la liste des joueurs
          broadcastPlayersList(room);
          console.log("Room created with player:", data.user_name);
          break;

        case 'join_room':
          const roomToJoin = rooms.get(data.room_id);
          if (roomToJoin) {
            currentRoom = roomToJoin;
            currentUser = data.user_name;
            roomToJoin.members.set(data.user_name, ws);
            
            // Envoyer la confirmation de connexion
            ws.send(JSON.stringify({
              kind: 'room_joined',
              room_id: data.room_id
            }));
            
            // Envoyer la liste mise à jour à tous les membres
            broadcastPlayersList(roomToJoin);
            console.log("Player joined room:", data.user_name);
          } else {
            ws.send(JSON.stringify({ kind: 'error', message: 'Room not found' }));
            ws.close();
          }
          break;

        case 'send_message':
          if (currentRoom && currentUser) {
            currentRoom.members.forEach((memberWs, username) => {
              if (username !== currentUser) {
                memberWs.send(JSON.stringify({
                  kind: 'message_received',
                  content: data.content,
                  sender: currentUser,
                }));
              } else {
                memberWs.send(JSON.stringify({
                  kind: 'message_send',
                  content: data.content,
                  sender: currentUser,
                }));
              }
            });
          }
          break;

        case 'disconnect':
          if (currentRoom && currentUser) {
            currentRoom.members.delete(currentUser);
            broadcastPlayersList(currentRoom);
            ws.close();
          }
          break;

        default:
          ws.send(JSON.stringify({ kind: 'error', message: 'Invalid message kind' }));
          ws.close();
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ kind: 'error', message: 'Invalid JSON' }));
      ws.close();
    }
  });

  ws.on('close', () => {
    if (currentRoom && currentUser) {
      currentRoom.members.delete(currentUser);
      broadcastPlayersList(currentRoom);
    }
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (currentRoom && currentUser) {
      currentRoom.members.delete(currentUser);
      broadcastPlayersList(currentRoom);
    }
    ws.close();
  });
});