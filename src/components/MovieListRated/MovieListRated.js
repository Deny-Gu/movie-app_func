import { Layout, Flex, Spin, Pagination } from "antd";
import { footerStyle, spinStyle } from "../App/appStyle";
import MovieItem from "../MovieItem/MovieItem";
import "./movieListStyle.css";
import { useEffect, useState } from "react";
import MovieService from "../../service/MovieService";
import { GenresContext } from "../GenresContext/GenresContext";

function MovieListRated(props) {
  let [moviesRated, setMoviesRated] = useState([]);
  let [paginationRated, setPaginationRated] = useState(1);
  let [totalRatedMovies, setTotalRatedMovies] = useState(0);
  let [loading, setLoading] = useState(false);
  let [notFound, setNotFound] = useState("");

  useEffect(() => {
    setLoading(true);
    getRatedMovies(props.guestSession, paginationRated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { Footer, Content } = Layout;

  let movieService = new MovieService();

  const getRatedMovies = (guestSession, page) => {
    let dataRatedMovies = movieService.getRatedMovies(guestSession, page);
    dataRatedMovies
      .then((data) => {
        if (data.results) {
          setMoviesRated((prevState) => data.results);
          setTotalRatedMovies((prevState) => data.total_results);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setNotFound("Вы еще не голосовали!");
      });
  };

  const handleChangePagination = (e) => {
    setLoading(true);
    setPaginationRated(e);
    getRatedMovies(props.guestSession, e);
  };

  return (
    <GenresContext.Consumer>
      {(value) => (
        <>
          <Content>
            <div className="movie-list">
              <Flex justify={"center"} gap={36} wrap={"wrap"}>
                {loading ? <Spin size={"large"} style={spinStyle} /> : null}
                {notFound ? <p>{notFound}</p> : null}
                {moviesRated &&
                  moviesRated.map((movie) => {
                    return (
                      <MovieItem
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        date={movie.release_date}
                        avatar={movie.poster_path}
                        genres={value}
                        genresId={movie.genre_ids}
                        ratingNumber={movie.vote_average}
                        ratingStars={movie.rating}
                        description={movie.overview}
                        addRatingMovie={props.addRatingMovie}
                        guestSession={props.guestSession}
                      />
                    );
                  })}
              </Flex>
            </div>
          </Content>
          <Footer style={footerStyle}>
            <Pagination
              onChange={(e) => handleChangePagination(e)}
              showSizeChanger={false}
              current={paginationRated}
              pageSize={20}
              total={totalRatedMovies}
            />
          </Footer>
        </>
      )}
    </GenresContext.Consumer>
  );
}

export default MovieListRated;
