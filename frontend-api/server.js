import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

const port = Number.parseInt(process.env.API_PORT || "3000", 10);
const host = process.env.API_HOST || "0.0.0.0";
const mongoUri =
	process.env.MONGODB_URI ||
	"mongodb+srv://Dylan:Dylan@qdcloud.8xeyc.mongodb.net/?retryWrites=true&w=majority&appName=QDcloud";

mongoose
	.connect(mongoUri)
	.then(() => {
		console.log("Connected to MongoDB Atlas");
	})
	.catch((err) => {
		console.error("MongoDB Atlas connection error:", err);
	});

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
	rank: Number,
});

const dailyArticleSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
		unique: true,
	},
	title: String,
});

const DailyArticle = mongoose.model(
	"DailyArticle",
	dailyArticleSchema,
	"DailyArticle",
);
const Ranking = mongoose.model("Ranking", rankingSchema, "Ranking");

app.get("/get-article", async (req, res) => {
	const dateParam = req.query.date;

	if (!dateParam) {
		return res
			.status(400)
			.json({ error: 'Missing "date" query parameter (YYYY-MM-DD)' });
	}

	try {
		const article = await DailyArticle.findOne({ date: dateParam });

		if (!article) {
			return res
				.status(404)
				.json({ error: "No article found for this date" });
		}

		return res.json({ title: article.title });
	} catch (err) {
		console.error("MongoDB error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

app.get("/ranking", async (req, res) => {
	const dateParam = req.query.date;
	if (!dateParam) {
		return res
			.status(400)
			.json({ error: "Missing 'date' query parameter" });
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
					rank: { $first: "$rank" },
					steps: { $first: "$steps" },
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

		return res.json(rankings);
	} catch (err) {
		console.error("MongoDB error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

app.post("/add-score", async (req, res) => {
	const { username, start_article, destination_article, path, steps } =
		req.body;

	if (
		!username ||
		!start_article ||
		!destination_article ||
		!path ||
		steps === undefined
	) {
		return res.status(400).json({ error: "Missing data" });
	}

	try {
		const rank = await getRank(steps);
		const newEntry = new Ranking({
			username,
			start_article,
			destination_article,
			path,
			steps,
			rank,
		});

		await newEntry.save();
		return res.json({
			success: true,
			message: "Score added successfully",
			rank,
		});
	} catch (err) {
		console.error("Error while adding score:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

async function getRank(currentSteps) {
	try {
		const players = await Ranking.find().sort({ steps: 1 });
		const betterPlayers = players.filter(
			(player) => player.steps < currentSteps,
		);
		return betterPlayers.length + 1;
	} catch (error) {
		console.error("Error while computing rank:", error);
		return 1;
	}
}

app.listen(port, host, () => {
	console.log(`Frontend API listening on http://${host}:${port}`);
});
