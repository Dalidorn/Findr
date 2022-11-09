//---GLOBAL VARIABLES---
var user = {
  username: ""
}

//---ELEMENT SELECTORS---
//buttons
var setupSubmitBtn = document.querySelector("#setupSubmit");
var recipeFavBtn = document.querySelector("#recipeFav");
var recipeNextBtn = document.querySelector("#recipeNext");
var favLinkBtn = document.querySelector("#favLink");
var editDPBtn = document.querySelector("#editDP");
var editDP2Btn = document.querySelector("#editDP2");
var recLinkBtn = document.querySelector("#recLink");

//pages
var displayWelcome = document.querySelector(".displayWelcome");
var displayRecipeSwiper = document.querySelector(".displayRecipeSwiper");
var displayFavorites = document.querySelector(".displayFavorites");
var detailsBlock = document.querySelector("#detailsBlock");
var recipeCard = document.querySelector("#recipeDisplay");

//nav menus
var toggleMenu = document.querySelector("#toggleMenu");
var sortFavMenu = document.querySelector("#sortFav");

//input fields
var usernameInput = document.querySelector("#usernameInput");

//---LOCAL STORAGE CHECK---
if(localStorage) {
  //potential to show a modal if local storage is detected for easy clearing.
  //TODO: Add code for what to do if the user already has stored data.
}

//---GENERAL FUNCTIONS---
function hide(variable) {
  variable.className += " hidden";
};

function show(variable) {
  variable.className -= " hidden";
};

function toggleActive(event) {
  if(event.target.className != "") {
    if(event.target.className == "inactive") {
    event.target.className = "active";
    } else {
    event.target.className = "inactive";
    };
  };
};

//---PAGE DISPLAY FUNCTIONS---
function showWelcomePage() {
  if(!displayRecipeSwiper.className.includes("hidden")) {
    hide(displayRecipeSwiper);
  };
  if(!displayFavorites.className.includes("hidden")) {
    hide(displayFavorites)
  };
  show(displayWelcome);
};

function showRecipeSwiper() {
  if(!displayWelcome.className.includes("hidden")) {
    hide(displayWelcome);
  };
  if(!displayFavorites.className.includes("hidden")) {
    hide(displayFavorites)
  };
  show(displayRecipeSwiper);
};

function showFavoritesPage() {
  if(!displayRecipeSwiper.className.includes("hidden")) {
    hide(displayRecipeSwiper);
  };
  if(!displayWelcome.className.includes("hidden")) {
    hide(displayRecipeSwiper)
  };
  show(displayFavorites);
};

//---RECIPE CARD FUNCTIONS---
function nextRecipe() {
  //TODO: Add code to move to the next response from the get request response.
};

function favRecipe() {
  //TODO: Add code to save the currently displayed recipe to local storage. Store entire recipe from get request so we can access those details later.
  nextRecipe();
};

function showRecipeDetails() {
  if(detailsBlock.className == "invisible") {
    detailsBlock.className = "";
  } else {
    detailsBlock.className = "invisible"
  };
};

//---DRAG AND DROP FUNCTIONALITY---


//---EVENT LISTENERS---
//welcome page
setupSubmitBtn.addEventListener("click", function(event) {
  event.preventDefault();
  user.username = usernameInput.value;
  console.log(user.username);
  showRecipeSwiper();
});

//recipe card meal type restrictor
toggleMenu.addEventListener("click", toggleActive);

//recipe card buttons
recipeFavBtn.addEventListener("click", favRecipe);
recipeNextBtn.addEventListener("click", nextRecipe);
recipeCard.addEventListener("dblclick", showRecipeDetails);

//recipe page nav
favLinkBtn.addEventListener("click", showFavoritesPage);
editDPBtn.addEventListener("click", showWelcomePage);

//favorites sorting
sortFavMenu.addEventListener("click", toggleActive);

//favorites page nav
editDP2Btn.addEventListener("click", showWelcomePage);
recLinkBtn.addEventListener("click", showRecipeSwiper);