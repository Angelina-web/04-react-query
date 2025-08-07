import css from "./App.module.css";
import { useState, useEffect } from "react";
import { fetchMovies } from "../../services/movieService";
import  ErrorMessage  from "../ErrorMessage/ErrorMessage";
import  Loader  from "../Loader/Loader";
import  MovieGrid  from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  useEffect(() => {
    if (!query) return;

    const getMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedMovies = await fetchMovies(query);
        if (fetchedMovies.length === 0) {
          toast.error("No movies found for your request.");
          setMovies([]);
          return;
        }
        setMovies(fetchedMovies);
      } catch {
        setError("There was an error, please try again...");
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [query]);

   const handleSearch = (query: string) => {
    setMovies([]); 
    setQuery(query); 
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
