let inputSearch = null;
let moviesList = null;

const createElement = ({
  type,
  attrs,
  container = null,
  position = "append",
}) => {
  const el = document.createElement(type);

  Object.keys(attrs).forEach((key) => {
    if (key !== "innerHTML") el.setAttribute(key, attrs[key]);
    else el.innerHTML = attrs[key];
  });

  if (container && position === "append") container.append(el);
  if (container && position === "prepend") container.prepend(el);

  return el;
};

const createStyle = () => {
  createElement({
    type: "style",
    attrs: {
      innerHTML: `
  * {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif
}
.container {
  padding: 20px;
  max-width: 1280px;
  margin: 0 auto;
}
.movies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.movie {
  display: flex;
  align-content: center;
  justify-content: center;
}
.movie__image {
  width: 100%;
  object-fit: cover;
}
.search {
  margin-bottom: 30px;
}
.search__input {
  display: block;
  max-width: 400px;
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid lightsteelblue;
}
.search__label-input {
display: block;
margin-bottom: 7px;
}
.search__label-checkbox {
font-size: 12px;
display: inline-block;
transform: translate(7px, -2px);
}`,
    },
    container: document.head,
  });
};

const createMarkup = () => {
  const container = createElement({
    type: "div",
    attrs: { class: "container" },
    container: document.body,
    position: "prepend",
  });

  createElement({
    type: "h1",
    attrs: { innerHTML: "Приложение для поиска фильмов" },
    container,
  });

  const searchBox = createElement({
    type: "div",
    attrs: { class: "search" },
    container,
  });

  const inputBox = createElement({
    type: "div",
    attrs: { class: "search__group search__group--input" },
    container: searchBox,
  });

  const checkBox = createElement({
    type: "div",
    attrs: { class: "search__group search__group--checkbox" },
    container: searchBox,
  });

  createElement({
    type: "label",
    attrs: {
      for: "search",
      class: "search__label-input",
      innerHTML: "Поиск фильмов",
    },
    container: inputBox,
  });

  inputSearch = createElement({
    type: "input",
    attrs: {
      class: "search__input",
      id: "search",
      type: "search",
      placeholder: "Начните вводить текст...",
    },
    container: inputBox,
  });

  createElement({
    type: "input",
    attrs: {
      class: "search__checkbox",
      id: "checkbox",
      type: "checkbox",
    },
    container: checkBox,
  });

  createElement({
    type: "label",
    attrs: {
      for: "checkbox",
      class: "search__label-checkbox",
      innerHTML: "Добавлять фильмы к существующему списку",
    },
    container: checkBox,
  });

  moviesList = createElement({
    type: "div",
    attrs: { class: "movies" },
    container,
  });
};

const addMovieToList = (movie) => {
  const item = createElement({
    type: "div",
    attrs: { class: "movie" },
    container: moviesList,
  });

  createElement({
    type: "img",
    attrs: {
      class: "movie__image",
      src: /^(http|https):\/\//i.test(movie.Poster)
        ? movie.Poster
        : "assets/img/no-img.png",
      alt: `${movie.Title}, ${movie.Year}`,
      title: `${movie.Title}, ${movie.Year}`,
    },
    container: item,
  });
};

const getData = (url) =>
  fetch(url)
    .then((response) => response.json())
    .then((json) => json.Search);

createMarkup();
createStyle();

let searchLast = null;

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
      console.log(searchString);
    }
    searchLast = searchString;
  }, 2000);
};

inputSearch.addEventListener("keyup", inputSearchHandler);

// getData(`http://www.omdbapi.com/?apikey=18b8609f&s=${search}`)
//   .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
//   .catch((err) => console.log(err));
