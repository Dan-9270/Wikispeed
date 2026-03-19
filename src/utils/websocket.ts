import { wsUrl } from "../config/endpoints";

const URL = wsUrl();
const socket = new WebSocket(URL);

socket.onopen = () => console.log("✅ WebSocket connecté !");
socket.onmessage = (event) => console.log("📩 Message reçu:", event.data);
socket.onerror = (error) => console.error("❌ Erreur WebSocket:", error);
socket.onclose = () => console.log("❌ WebSocket déconnecté");

export default socket;