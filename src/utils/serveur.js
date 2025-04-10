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
  const dailyArticleSchema = new mongoose.Schema({
    date: {
      type: Date, // ✅ Changement ici
      required: true,
      unique: true
    },
    title: String,
  });
  
  const DailyArticle = mongoose.model('DailyArticle', dailyArticleSchema, 'DailyArticle');
  

  const Ranking = mongoose.model('Ranking', rankingSchema, 'Ranking');


// 📆 Caching d'article par jour
let cachedArticle = null;
let lastFetchDate = null;
app.get('/get-article', async (req, res) => {
  const dateParam = req.query.date; // Format attendu : YYYY-MM-DD

  if (!dateParam) {
    return res.status(400).json({ error: 'Paramètre "date" requis (format : YYYY-MM-DD)' });
  }

  try {
    // Recherche l'article correspondant à la date au format "YYYY-MM-DD"
    const article = await DailyArticle.findOne({ date: dateParam });


    if (!article) {
      return res.status(404).json({ error: 'Aucun article trouvé pour cette date' });
    }

    // Retourner uniquement le titre de l'article
    res.json({
      title: article.title,
    });
  } catch (err) {
    console.error('❌ Erreur MongoDB :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.get("/ranking", async (req, res) => {
  console.log("📥 Route /ranking appelée");

  const dateParam = req.query.date;
  if (!dateParam) {
    return res.status(400).json({ error: "Paramètre 'date' manquant" });
  }

  const date = new Date(dateParam);
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);

  try {
    const rankings = await Ranking.aggregate([
      {
        $match: {
          date: {
            $gte: date,
            $lt: nextDate,
          },
        },
      },
      {
        $sort: { rank: 1 },
      },
      {
        $group: {
          _id: "$username",
          rank: { $first: "$rank" }, // Meilleur rank
          steps: { $first: "$steps" }, // Steps associés au meilleur rank
        },
      },
      {
        $sort: { rank: 1 },
      },
      {
        $project: {
          _id: 0,
          username: "$_id",
          rank: 1,
          steps: 1,
        },
      },
    ]);

    console.log("✅ Classement trouvé :", rankings);
    res.json(rankings);
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
  