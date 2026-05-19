import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

const Movie = mongoose.model("Movie", movieSchema);

app.get("/", (req, res) => {
  res.send("MovieShelf API is running");
});

app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ created_at: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error getting movies" });
  }
});

app.post("/api/movies", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating movie" });
  }
});

app.patch("/api/movies/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: "Error updating movie" });
  }
});

app.delete("/api/movies/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting movie" });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });