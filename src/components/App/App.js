import Navigation from "../Navigation/Navigation";
import MovieListRated from "../MovieListRated/MovieListRated";
import MovieService from "../../service/MovieService";
import MovieListSearch from "../MoviesListSearch/MoviesListSearch";
import MovieListPopular from "../MoviesListPopular/MoviesListPopular";
import { GenresContext } from "../GenresContext/GenresContext";
import { Layout, Input, Spin, Alert, ConfigProvider } from "antd";
import {
  layoutStyle,
  headerStyle,
  spinStyle,
  alertStyle,
} from "../App/appStyle";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

function App() {
  let [guestSession, setGuestSession] = useState("");
  let [moviesSearch, setMoviesSearch] = useState([]);
  let [moviesPopular, setMoviesPopular] = useState([]);
  let [genres, setGenres] = useState([]);
  let [page, setPage] = useState("");
  let [input, setInput] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [notFound, setNotFound] = useState("");
  let [paginationSearch, setPaginationSearch] = useState(1);
  let [paginationPopular, setPaginationPopular] = useState(1);
  let [totalSearchMovies, setTotalSearchMovies] = useState(0);
  let [totalPopularMovies, setTotalPopularMovies] = useState(0);

  const { Header, Content } = Layout;
  const movieService = new MovieService();

  useEffect(() => {
    getGuestSession();
    getGenres();
    getMoviesPopular(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGuestSession = () => {
    setLoading(true);
    let dataGuestSession = movieService.guestSession();
    dataGuestSession
      .then((data) => {
        setGuestSession(data.guest_session_id);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  };

  const getGenres = () => {
    setLoading(true);
    let dataGenres = movieService.getGenres();
    dataGenres
      .then((data) => {
        setGenres(data.genres);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  };

  const getMoviesSearch = (page, value) => {
    let dataMovies = movieService.getMovies(value, page);
    dataMovies
      .then((data) => {
        data.results.length === 0 && input
          ? setNotFound("Ничего не найдено!")
          : setNotFound("");
        setMoviesSearch(data.results);
        data.total_pages > 5000
          ? setTotalSearchMovies(5000)
          : setTotalSearchMovies(data.total_pages);
        data.results.length === 0 && setNotFound("Ничего не найдено!");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  };

  const getMoviesPopular = (page) => {
    let dataPopularMovies = movieService.getPopularMovie(page);
    dataPopularMovies
      .then((data) => {
        setMoviesPopular(data.results);
        data.total_pages > 5000
          ? setTotalPopularMovies(5000)
          : setTotalPopularMovies(data.total_pages);
        setMoviesSearch(data.results);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  const addRatingMovie = (movieId, rating, guestSessionId, paginationRated) => {
    let dataRatedMovies = movieService.addRatingMovie(
      movieId,
      rating,
      guestSessionId,
      paginationRated,
    );
    let newArr = moviesSearch.map((movie) =>
      movie.id === movieId ? { ...movie, rating: rating } : movie,
    );
    setMoviesSearch(newArr);
    return dataRatedMovies;
  };

  const debounceFunc = useMemo(
    () =>
      debounce((fn, page, valueInput) => {
        fn(page, valueInput);
      }, 1000),
    [],
  );

  const handleChangeInput = (e) => {
    setPage("Search");
    setNotFound("");
    setInput(e.target.value);
    setLoading(true);
    setPaginationSearch(1);
    debounceFunc(getMoviesSearch, paginationSearch, e.target.value);
  };

  const handleChangePagination = (e, setPagination, getMovie) => {
    setPagination(e);
    getMovie(e, input);
  };

  const errorMessage = (
    <Alert
      message="Error! Что-то пошло не так..."
      type="error"
      style={alertStyle}
      showIcon
    />
  );

  const contentMovie = (
    <MovieListSearch
      paginationSearch={paginationSearch}
      moviesSearch={moviesSearch}
      totalSearchMovies={totalSearchMovies}
      guestSession={guestSession}
      addRatingMovie={addRatingMovie}
      setPaginationSearch={setPaginationSearch}
      getMoviesSearch={getMoviesSearch}
      handleChangePagination={handleChangePagination}
    />
  );

  const contentPopular = (
    <MovieListPopular
      paginationPopular={paginationPopular}
      moviesPopular={moviesPopular}
      totalPopularMovies={totalPopularMovies}
      guestSession={guestSession}
      addRatingMovie={addRatingMovie}
      setPaginationPopular={setPaginationPopular}
      getMoviesPopular={getMoviesPopular}
      handleChangePagination={handleChangePagination}
    />
  );

  const contentRated = <MovieListRated guestSession={guestSession} />;

  const hasData = !error && !loading;

  return (
    <GenresContext.Provider value={genres}>
      <ConfigProvider
        theme={{
          components: {
            Pagination: { itemActiveBg: "#1677ff", colorPrimary: "#fff" },
          },
        }}
      >
        <Layout style={layoutStyle}>
          <Header style={headerStyle}>
            <Navigation setPage={setPage} />
            {page !== "Rated" && (
              <Input
                value={input}
                onChange={(e) => {
                  handleChangeInput(e);
                }}
                placeholder="Type to search..."
              />
            )}
          </Header>
          {loading ? (
            <Content>
              <Spin size={"large"} style={spinStyle} />
            </Content>
          ) : null}
          {error && errorMessage}
          {!page && hasData && contentPopular}
          {page === "Search" && hasData && notFound && <p>{notFound}</p>}
          {page === "Search" && hasData && contentMovie}
          {page === "Rated" && hasData && contentRated}
        </Layout>
      </ConfigProvider>
    </GenresContext.Provider>
  );
}

export default App;
