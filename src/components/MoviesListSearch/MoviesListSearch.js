import { Layout, Flex, Pagination } from "antd";
import { footerStyle } from "../App/appStyle";
import MovieItem from "../MovieItem/MovieItem";
import "../MovieListRated/movieListStyle.css";
import { GenresContext } from "../GenresContext/GenresContext";

function MovieListSearch(props) {
  const { Footer, Content } = Layout;

  return (
    <GenresContext.Consumer>
      {(value) => (
        <>
          <Content>
            <div className="movie-list">
              <Flex justify={"center"} gap={36} wrap={"wrap"}>
                {props.moviesSearch &&
                  props.moviesSearch.map((movie) => {
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
              onChange={(e) =>
                props.handleChangePagination(
                  e,
                  props.setPaginationSearch,
                  props.getMoviesSearch,
                )
              }
              showSizeChanger={false}
              current={props.paginationSearch}
              pageSize={20}
              total={props.totalSearchMovies}
            />
          </Footer>
        </>
      )}
    </GenresContext.Consumer>
  );
}

export default MovieListSearch;
