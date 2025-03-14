
import WebSocket from 'ws';

export interface Room {
  id: string;
  members: Map<string, WebSocket>; // usernames linked to their websocket
}

let rooms = new Map<string, Room>();

const wss = new WebSocket.Server({ port: 2025 });

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  let currentRoom: Room | null = null;
  let currentUser: string | null = null;

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      const roomId= data.roomID
      switch (data.kind) {
        case 'create_room':
          const room: Room = {
            id: roomId,
            members: new Map(),
          };
          rooms.set(roomId, room);
          currentRoom = room;
          currentUser = data.user_name;
          room.members.set(data.user_name, ws);
          ws.send(JSON.stringify({ kind: 'room_created', room_id: roomId ,users:Array.from(room.members.keys())}));
          console.log(data)
          break;

        case 'join_room':
          const roomToJoin = rooms.get(data.room_id);
          if (roomToJoin) {
            currentRoom = roomToJoin;
            currentUser = data.user_name;
            roomToJoin.members.set(data.user_name, ws);
            ws.send(JSON.stringify({
              kind: 'room_joined',
              users: Array.from(roomToJoin.members.keys()),

            }));
            console.log(data);

            roomToJoin.members.forEach((memberWs, username) => {
              if (username !== data.user_name) {
                memberWs.send(JSON.stringify({ kind: 'user_joined', user_name: data.user_name,users:Array.from(roomToJoin.members.keys()) }));
              }
            });
          } else {
            ws.send(JSON.stringify({ kind: 'error', message: 'Room not found' }));
            ws.close();
          }
          break;
          ws.close();

        case 'send_message':
          if (currentRoom && currentUser) {
            currentRoom.members.forEach((memberWs, username) => {
              if (username !== currentUser) {
                memberWs.send(JSON.stringify({
                  kind: 'received-message',
                  content: data.content,
                  sender: currentUser,
                  photo: data.photo,
                }));
              }else{
                memberWs.send(JSON.stringify({
                  kind: 'send_message',
                  content : data.content,
                  sender: currentUser,
                  photo: data.photo,
                }));
              }
            });
          }
          console.log(data);
          break;

        case 'disconnect':
          if (currentRoom && currentUser) {
            currentRoom.members.delete(currentUser);
            // Notify other users in the room
            currentRoom.members.forEach((memberWs, username) => {
              memberWs.send(JSON.stringify({ kind: 'user_left', user_name: currentUser }));
            });
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
      // Notify other users in the room
      currentRoom.members.forEach((memberWs, username) => {
        memberWs.send(JSON.stringify({ kind: 'user_left', user_name: currentUser }));
      });
    }
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (currentRoom && currentUser) {
      currentRoom.members.delete(currentUser);
      // Notify other users in the room
      currentRoom.members.forEach((memberWs, username) => {
        memberWs.send(JSON.stringify({ kind: 'user_left', user_name: currentUser }));
      });
    }
    ws.close();
  });
});