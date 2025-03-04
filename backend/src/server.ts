import WebSocket from 'ws';
import { randomUUID } from 'crypto';

const wss = new WebSocket.Server({ port: 2025 });

wss.on("connection", (ws: WebSocket) => {
  console.log("✅ Nouveau client connecté");

  const roomIdentifier = randomUUID();
  console.log(`Identifiant de salon généré: ${roomIdentifier}`);

  ws.on("message", (message: string) => {
    console.log("📩 Message reçu:", message);

    ws.send(`🔄 ${message.toUpperCase()}`);
  });

  ws.on("close", () => {
    console.log("❌ Client déconnecté");
  });

  ws.send(`Votre salon a été créé avec l'ID: ${roomIdentifier}`);
});

console.log("🚀 Serveur WebSocket démarré sur ws://localhost:2025");
