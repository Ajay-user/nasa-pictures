const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");

const cardContainer = document.getElementById("card-container");

const confirmationMsgEl = document.getElementById("confirmation");

const loader = document.getElementById("loader");

// global var
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=${count}`;

// display loader
const toggleLoader = () => loader.classList.toggle("hidden");

// display confirmation msg
const confirmationMessage = (msg, color) => {
  confirmationMsgEl.textContent = msg;
  confirmationMsgEl.hidden = false;
  confirmationMsgEl.style.color = color;
  setTimeout(() => (confirmationMsgEl.hidden = true), 2000);
};

// get from local storage
const getStore = () => JSON.parse(window.localStorage.getItem("NasaFav"));

// set local storage
const addToLocalStorage = (key, val) => {
  const store = getStore();
  if (!store[key]) {
    store[key] = val;
    window.localStorage.setItem("NasaFav", JSON.stringify(store));
    confirmationMessage(`added${"❤️"}`, "lightseagreen");
    return;
  }
  confirmationMessage(`exists${"✔️"}`, "salmon");
};

// add image info to favorite list
const addToFavorites = (image) => {
  const key = image.url;
  addToLocalStorage(key, image);
};

// remove image info from favorite list
const removeFromFavorites = (image) => {
  const store = getStore();
  if (store) {
    delete store[image.url];
    window.localStorage.setItem("NasaFav", JSON.stringify(store));
    confirmationMessage(`removed${"🔧"}`, "darksalmon");
    // load a new set of images if store is empty
    Object.keys(store).length > 0 ? loadFav((scroll = false)) : loadMoreNasa();
    return;
  }
};

// update the DOM by populating cards with images  and details
const updateDOM = (imageArray, fav = false) => {
  toggleLoader();
  imageArray.forEach((image) => {
    // card
    const card = document.createElement("div");
    card.classList.add("card");
    // image-container
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    // anchor-tag
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = image.media_type === "image" ? image.hdurl : image.url;
    // image el
    const img = document.createElement("img");
    img.src = image.url;
    img.alt =
      image.media_type === "image" ? "NASA IMAGE OF THE DAY" : image.url;
    img.loading = "lazy";
    // card-body
    const body = document.createElement("div");
    body.classList.add("card-body");
    // h5
    const title = document.createElement("h5");
    title.classList.add("title");
    title.textContent = image.title;
    // add-to-fav  <p>
    const addToFav = document.createElement("p");
    addToFav.classList.add("clickable");
    addToFav.textContent = fav ? "Remove from favorites" : "Add to favorites";
    addToFav.onclick = () =>
      fav ? removeFromFavorites(image) : addToFavorites(image);
    // description <p>
    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = image.explanation;
    // small
    const small = document.createElement("small");
    // strong
    const strong = document.createElement("strong");
    strong.textContent = image.date;
    // copyright
    const copyright = document.createElement("span");
    copyright.textContent = image.copyright ? ` ${image.copyright}` : "";

    // construction
    small.append(strong, copyright);
    body.append(title, addToFav, description, small);
    link.appendChild(img);
    imageContainer.appendChild(link);
    card.append(imageContainer, body);
    cardContainer.appendChild(card);
  });
};

// fetch
const getImages = async () => {
  toggleLoader();
  try {
    const response = await fetch(apiUrl);
    const imageArray = await response.json();
    updateDOM(imageArray);
  } catch (error) {
    console.log(error);
  }
};

const toggleNavIcons = () => {
  resultsNav.classList.toggle("hidden");
  favoritesNav.classList.toggle("hidden");
};

// favorites
const loadFav = (scroll = true) => {
  toggleLoader(); //display loader
  const favs = getStore();
  imageArray = Object.values(favs);
  console.log("image array", imageArray);
  if (imageArray.length > 0) {
    cardContainer.textContent = "";
    toggleNavIcons();
    updateDOM(imageArray, true);
    if (scroll) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    return;
  }
  confirmationMessage(`Empty${"☹️"}`);
  toggleLoader(); // hide loader
};

// loads more images
const loadMore = () => getImages();

// load a new set of nasa imagase
const loadMoreNasa = () => {
  cardContainer.textContent = "";
  toggleNavIcons();
  loadMore();
};

// onload create a localstorage if it doesn't exists
const createStore = () => {
  const store = window.localStorage.getItem("NasaFav");
  if (!store) {
    window.localStorage.setItem("NasaFav", "{}");
  }
};

// onload
createStore();
getImages();
