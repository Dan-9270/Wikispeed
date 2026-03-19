import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';  
import Article from './Articles.js';
import { exec } from "child_process";

const app = express();
const port = Number.parseInt(process.env.SOLVER_PORT || '3001', 10);
const host = process.env.SOLVER_HOST || '0.0.0.0';
const mongoUri = process.env.MONGODB_URI_SOLVER || process.env.MONGODB_URI || 'mongodb+srv://User:User@qdcloud.8xeyc.mongodb.net/?retryWrites=true&w=majority&appName=QDcloud';

app.use(cors());
app.use(express.json());

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

app.get("/articles", async (req, res) => {
  try {
    const { title } = req.query;

    let query = {};
    let result = {};

    if (title) {
      query = { title: { $regex: new RegExp(title, 'i') } };
    }

    const article = await Article.find(query);

    if (article.length > 0) {
      result.articlePopularity = article[0].popular;
    } else {
      result.articlePopularity = null; 
    }

    const firstArticle = await Article.findOne(); 
    if (firstArticle) {
      result.firstArticlePopularity = firstArticle.popular;
    } else {
      result.firstArticlePopularity = null; 
    }

    res.json(result);
  } catch (err) {
    console.error("❌ Erreur GET /articles :", err);
    res.status(500).json({ message: "Erreur lors de la recherche de popularité", error: err });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/solve", (req, res) => {
  const { start_id, target_id } = req.query;

  if (!start_id || !target_id) {
    return res.status(400).send("start_id and target_id are required.");
  }

  const escapedStartId = `"${start_id}"`;
  const escapedTargetId = `"${target_id}"`;

  exec(
    `python3 solver.py ${escapedStartId} ${escapedTargetId}`,
    { encoding: "utf8" }, 
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send(`stderr: ${stderr}`);
      }

      try {
        const lines = stdout.trim().split('\n');
        const data = {};

        lines.forEach(line => {
          const [key, value] = line.split(/:\s(.+)/);  
          if (key === 'Distance') {
            data.Distance = parseInt(value);
          } else if (key === 'Path') {
            data.Path = JSON.parse(value.replace(/'/g, '"'));
          }
        });

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.json(data);
      } catch (parseError) {
        console.error("Erreur de parsing du JSON du Python:", parseError);
        return res.status(500).send("Invalid format from Python script.");
      }
    }
  );
});

app.listen(port, host, () => {
  console.log(`🚀 API Popularité en ligne sur http://localhost:${port}`);
});
