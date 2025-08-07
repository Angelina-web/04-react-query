import css from "./App.module.css";
import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["articles", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 0;

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-right" />

      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage
          message={(error as Error).message || "Something went wrong"}
        />
      )}
      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel="→"
          previousLabel="←"
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={3}
          onPageChange={({ selected }) => {
            setCurrentPage(selected + 1);
          }}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
        />
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
