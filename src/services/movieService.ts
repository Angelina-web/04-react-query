import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieHttpResponse> => {
  const response = await axios.get<MovieHttpResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
};
