
import WebSocket from 'ws';

export interface Player {
  id: number;
  name: string;
  time: number | null;
  avatar: string;
  score: number | null;
  history: string[];
  articles: Map<string, boolean>;
}



export interface Room {
  parameters: any;
  isPlaying: boolean;
  end : boolean;
  id: string;
  players: Player[];
  members: Map<string, WebSocket>; // usernames linked to their websocket
  mined :Map <number, string[][]>;
}
let rooms = new Map<string, Room>();

const wsPort = Number.parseInt(process.env.WS_PORT || '2025', 10);
const wss = new WebSocket.Server({ port: wsPort });

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
            parameters:null,
            isPlaying: false,
            id: roomId,
            players: [],
            end: false,
            mined: new Map(),
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

          case 'start_game':
            if (currentRoom ) {
              currentRoom.isPlaying = true;
              currentRoom.members.forEach((memberWs, username) => {
                  memberWs.send(JSON.stringify({
                    kind: 'start-game',
                    isPlay: true,
                  }));
  
              });
            }
            console.log(data);
            break;

            case 'finish_game':
            if (currentRoom ) {
              currentRoom.isPlaying = true;
              currentRoom.members.forEach((memberWs, username) => {
                  memberWs.send(JSON.stringify({
                    kind: 'finish-game',
                    end: true,
                  }));
  
              });
            }
            console.log(data);
            break;

            case 'parameters':
              if (currentRoom ) {
                currentRoom.parameters = data.parameters;
                currentRoom.members.forEach((memberWs, username) => {
                    memberWs.send(JSON.stringify({
                      kind: 'parameters-for-game',
                      parameters: data.parameters,
                    }));
    
                });
              }
              console.log(data);
              break;
  
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

        case 'update_article_status':
          if (currentRoom && currentUser) {
            currentRoom.members.forEach((memberWs, username) => {
              if (username !== currentUser) {
                memberWs.send(JSON.stringify({
                  kind: 'update_article_status',
                  title: data.title,
                  status: data.status,
                  sender: currentUser,
                }));
              }else{
                memberWs.send(JSON.stringify({
                  kind: 'update_article_status',
                  title: data.title,
                  status: data.status,
                  sender: currentUser,
                }));
              }
            });
          }

          case 'player_at_the_end':
            if (currentRoom && currentUser) {
             
              // Ajout du joueur à la liste des joueurs
              const player: Player = {
                id: data.players.id,
                name: data.players.name,
                time: data.players.time,
                avatar: data.players.avatar,
                score: data.players.score,
                history: data.players.history,
                articles: data.articles,
              };
              const existingIndex = currentRoom.players.findIndex(p => p.id === player.id);

              if (existingIndex !== -1) {
                // Le joueur existe → on le remplace
                currentRoom.players[existingIndex] = player;
              } else {
                // Sinon on l’ajoute
                currentRoom.players.push(player);
                currentRoom.mined.set(player.id, []);
              }              currentRoom.members.forEach((memberWs, username) => {
                console.log("player_at_the_end", data.players);
                // Envoi des joueurs à tous les membres
                memberWs.send(JSON.stringify({
                  kind: 'player-finished',
                  players: currentRoom?.players, // Envoie toute la liste des joueurs
                  sender: currentUser,
                }));
              });
            }
            break;

          case 'mine':
            if (currentRoom && currentUser) {
              // Ajout du joueur à la liste des joueurs
              const mine: string[][] = data.mined;
              const mined = currentRoom.mined;
                currentRoom.mined.set(data.id, mine);
              currentRoom.members.forEach((memberWs, username) => {
                console.log("mine", data.mined);
                console.log("liste des mines", mined);
                // Envoi des joueurs à tous les membres
                memberWs.send(JSON.stringify({
                  kind: 'mine',
                  id: data.id,
                  mined: Array.from(mined.entries()),
                  sender: currentUser,
                }));

              }
              );
            }
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

console.log(`WebSocket server started on ws://0.0.0.0:${wsPort}`);