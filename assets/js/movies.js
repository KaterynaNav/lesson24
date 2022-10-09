import {
  createMarkup,
  createStyle,
  addMovieToList,
  clearMoviesMarkup,
  inputSearch,
  moviesList,
  triggerMode,
} from "./dom.js";

let apiUrl = null;
let searchLast = null;

const getData = (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((json) => json.Search);

const debounce = (() => {
  let timer = null;

  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(cb, ms);
  };
})();

const inputSearchHandler = (e) => {
  debounce(() => {
    const searchString = e.target.value.trim();
    if (
      searchString &&
      searchString.length > 3 &&
      searchString !== searchLast
    ) {
      if (!triggerMode) clearMoviesMarkup(moviesList);

      getData(`${apiUrl}/?apikey=18b8609f&s=${searchString}`)
        .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
        .catch((err) => console.log(err));
    }
    searchLast = searchString;
  }, 2000);
};

export const appInit = (url) => {
  createMarkup();
  createStyle();
  apiUrl = url || "https://www.omdbapi.com";
  inputSearch.addEventListener("keyup", inputSearchHandler);
};
