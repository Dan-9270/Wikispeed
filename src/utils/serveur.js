import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import mongoose from 'mongoose';




const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.static("public"));
const port = 3000;

// 🔌 Connexion à MongoDB
mongoose.connect('mongodb+srv://Dylan:Dylan@qdcloud.8xeyc.mongodb.net/?retryWrites=true&w=majority&appName=QDcloud')
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB Atlas :', err);
  });




// 📦 Schéma & modèle pour la collection "Ranking"
const rankingSchema = new mongoose.Schema({
    username: String,
    date: {
      type: Date,
      default: Date.now,
    },
    start_article: String,
    destination_article: String,
    path: String,
    steps: Number,
    rank: Number
  });
  

  const Ranking = mongoose.model('Ranking', rankingSchema, 'Ranking');


// 📆 Caching d'article par jour
let cachedArticle = null;
let lastFetchDate = null;

async function fetchDailyArticle() {
  const today = new Date().toISOString().split('T')[0];

  if (lastFetchDate !== today || !cachedArticle) {
    console.log('🔄 Nouvelle récupération d’article pour la date :', today);

    try {
      const response = await fetch('https://fr.wikipedia.org/api/rest_v1/page/random/summary');
      const data = await response.json();
      console.log('✅ Article récupéré :', data.title);

      cachedArticle = data;
      lastFetchDate = today;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l’article :', error);
      cachedArticle = { title: 'Erreur', extract: 'Impossible de charger un article.' };
    }
  } else {
    console.log('📦 Article en cache utilisé :', cachedArticle.title);
  }

  return cachedArticle;
}

// 🧠 GET : Récupérer l'article du jour
app.get('/get-article', async (req, res) => {
  const article = await fetchDailyArticle();
  res.json(article);
});



app.get("/ranking", async (req, res) => {
    console.log("📥 Route /ranking appelée");
  
    try {
      const users = await Ranking.find();
      console.log("✅ Utilisateurs trouvés :", users);
      res.json(users);
    } catch (err) {
      console.error("❌ Erreur MongoDB :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  

  app.post('/add-score', async (req, res) => {
    const { username, start_article, destination_article, path, steps } = req.body;
  
    if (!username || !start_article || !destination_article || !path || steps === undefined) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
  
    try {
      const rank = await getRank(steps); // ✅ Appel ici
      const newEntry = new Ranking({
        username,
        start_article,
        destination_article,
        path,
        steps,
        rank,
      });
  
      await newEntry.save();
      res.json({ success: true, message: 'Score ajouté avec succès', rank });
      
    } catch (err) {
      console.error("Erreur lors de l'ajout du score :", err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  
  

  
  // Calculer le rang en fonction des scores existants
  async function getRank(currentSteps) {
    try {
      // Récupère tous les joueurs triés par steps croissant
      const players = await Ranking.find().sort({ steps: 1 });
      console.log("🧑‍🤝‍🧑 Joueurs trouvés :", players.map(p => ({ name: p.username, steps: p.steps })));

  
      // Trouve la position du joueur en fonction de son nombre de steps
      const betterPlayers = players.filter(player => player.steps < currentSteps);
      const rank = betterPlayers.length + 1;
  
      return rank;
    } catch (error) {
      console.error('❌ Erreur lors du calcul du rang:', error);
      return 1; // Valeur par défaut en cas d'erreur
    }
  }
  




app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
  });
  