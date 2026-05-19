import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [movies, setMovies] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: ""
  });

  const [editingId, setEditingId] = useState(null);

  const getMovies = async () => {
    const response = await axios.get(`${API_URL}/api/movies`);
    setMovies(response.data);
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieData = {
      title: formData.title,
      genre: formData.genre,
      rating: Number(formData.rating)
    };

    if (editingId) {
      await axios.patch(
        `${API_URL}/api/movies/${editingId}`,
        movieData
      );

      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/movies`, movieData);
    }

    setFormData({
      title: "",
      genre: "",
      rating: ""
    });

    getMovies();
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);

    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/movies/${id}`);
    getMovies();
  };

  return (
    <main className="container">
      <section className="hero">
        <h1>MovieShelf</h1>
        <p>Track your favorite movies with a MERN CRUD app.</p>
      </section>

      <section className="card">
        <h2>
          {editingId ? "Update Movie" : "Add a Movie"}
        </h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="rating"
            placeholder="Rating"
            min="1"
            max="10"
            value={formData.rating}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Save Update" : "Add Movie"}
          </button>
        </form>
      </section>

      <section className="movie-grid">
        {movies.map((movie) => (
          <article key={movie._id} className="movie-card">
            <h3>{movie.title}</h3>

            <p>
              <strong>Genre:</strong> {movie.genre}
            </p>

            <p>
              <strong>Rating:</strong> {movie.rating}/10
            </p>

            <small>
              Added:{" "}
              {new Date(
                movie.created_at
              ).toLocaleDateString()}
            </small>

            <div className="actions">
              <button onClick={() => handleEdit(movie)}>
                Edit
              </button>

              <button
                className="delete"
                onClick={() =>
                  handleDelete(movie._id)
                }
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;