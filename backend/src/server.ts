import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 2025 });

wss.on("connection", (ws: WebSocket) => {
  console.log("✅ Nouveau client connecté");

  ws.on("message", (message: string) => {
    console.log("📩 Message reçu:", message);
    ws.send(`🔄 ${message}`.toUpperCase()); // Répond en majuscules
  });

  ws.on("close", () => {
    console.log("❌ Client déconnecté");
  });
});

console.log("🚀 Serveur WebSocket démarré sur ws://localhost:2025");
