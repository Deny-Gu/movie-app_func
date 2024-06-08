class MovieService {
  _options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjZhYzI3NWUwNDJjNmM4OWE2ZDlkOWYwYTU3NjJhZiIsInN1YiI6IjY2NWIzYTMwYTdjODkwMDVhNWJjM2ZhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vl3QqY-iKAueOYZvgSvueBEtFRvX-gjuxePHjLHAHAg",
    },
  };

  async getMovies(query, page) {
    let res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
      this._options,
    );
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  }

  async getPopularMovie(page) {
    let res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      this._options,
    );
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  }

  async guestSession() {
    let res = await fetch(
      "https://api.themoviedb.org/3/authentication/guest_session/new",
      this._options,
    );
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  }

  async addRatingMovie(movieId, rating, sessionId) {
    try {
      let res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjZhYzI3NWUwNDJjNmM4OWE2ZDlkOWYwYTU3NjJhZiIsInN1YiI6IjY2NWIzYTMwYTdjODkwMDVhNWJjM2ZhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vl3QqY-iKAueOYZvgSvueBEtFRvX-gjuxePHjLHAHAg",
          },
          body: `{"value": ${rating}}`,
        },
      );
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async getRatedMovies(guestSessionID, page) {
    let res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionID}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjZhYzI3NWUwNDJjNmM4OWE2ZDlkOWYwYTU3NjJhZiIsInN1YiI6IjY2NWIzYTMwYTdjODkwMDVhNWJjM2ZhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vl3QqY-iKAueOYZvgSvueBEtFRvX-gjuxePHjLHAHAg",
        },
      },
    );
    if (res.status === 404) {
      return console.log("Не найдено!");
    }
    return res.json();
  }

  async getGenres() {
    let res = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjZhYzI3NWUwNDJjNmM4OWE2ZDlkOWYwYTU3NjJhZiIsInN1YiI6IjY2NWIzYTMwYTdjODkwMDVhNWJjM2ZhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Vl3QqY-iKAueOYZvgSvueBEtFRvX-gjuxePHjLHAHAg",
        },
      },
    );
    if (res.status === 404) {
      return console.log("Не найдено!");
    }
    return res.json();
  }
}

export default MovieService;
