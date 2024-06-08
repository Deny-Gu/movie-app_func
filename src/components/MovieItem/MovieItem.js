import { Rate } from "antd";
import { format } from "date-fns";
import "./movieItemStyle.css";
import noPoster from "../../img/no-poster.jpg";
import { useEffect, useState } from "react";

function MovieItem(props) {
  let [color, setColor] = useState("");

  useEffect(() => {
    getRatingColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRatingColor = () => {
    if (props.ratingNumber < 3) {
      setColor("#E90000");
      return;
    }
    if (props.ratingNumber < 5) {
      setColor("#E97E00");
      return;
    }
    if (props.ratingNumber < 7) {
      setColor("#E9D100");
      return;
    }
    if (props.ratingNumber > 7) {
      setColor("#66E900");
      return;
    }
  };

  const shortenDescription = (str, maxLen, separator = " ") => {
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + " ...";
  };

  const getGenresName = () => {
    return props.genresId.map((id) => {
      return props.genres.map((genres) =>
        genres.id === id ? <li key={genres.id}>{genres.name}</li> : null,
      );
    });
  };

  const genresName = getGenresName();

  return (
    <div className="movie-item">
      <div className="movie-item__image">
        {props.avatar ? (
          <img
            src={"https://image.tmdb.org/t/p/w500/" + props.avatar}
            className="movie-item__avatar"
            alt={props.title}
          />
        ) : (
          <img
            src={noPoster}
            className="movie-item__avatar"
            alt={props.title}
          />
        )}
      </div>
      <div className="movie-item__header">
        <h1>{shortenDescription(props.title, 30)}</h1>
        <span
          className="movie-item__rating-number"
          style={{ borderColor: color }}
        >
          {props.ratingNumber && props.ratingNumber.toFixed(1)}
        </span>
        <span className="movie-item__date">
          {props.date && format(props.date, "PP")}
        </span>
        <ul className="movie-item__genre">{genresName}</ul>
      </div>
      <div className="movie-item__main">
        <p className="movie-item__description">
          {shortenDescription(props.description, 180)}
        </p>
        <span className="movie-item__rating-stars">
          <Rate
            allowHalf
            onChange={(e) =>
              props.addRatingMovie(props.id, e, props.guestSession)
            }
            defaultValue={!props.ratingStars ? 0 : props.ratingStars}
            count={10}
          />
        </span>
      </div>
    </div>
  );
}

export default MovieItem;
