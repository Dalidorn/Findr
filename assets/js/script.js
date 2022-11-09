//---GLOBAL VARIABLES---

//---ELEMENT SELECTORS---
var setupSubmit = document.querySelector("#setupSubmit");
var displayWelcome = document.querySelector(".displayWelcome");
var displayRecipeSwiper = document.querySelector(".displayRecipeSwiper");
var toggleMenu = document.querySelector("#toggleMenu");
var recipeFavBtn = document.querySelector("#recipeFav");
var recipeNextBtn = document.querySelector("#recipeNext");
var recipeMoreBtn = document.querySelector("#recipeMore");
var detailsBlock = document.querySelector("#detailsBlock");


//---GENERAL FUNCTIONS---
function hide(variable) {
  variable.className += " hidden";
};

function show(variable) {
  variable.className -= " hidden";
};

//---RECIPE CARD FUNCTIONS---
function nextRecipe() {
  //TODO: Add code to move to the next response from the get request response.
}

function favRecipe() {
  //TODO: Add code to save the currently displayed recipe to local storage. Store entire recipe from get request so we can access those details later.
  nextRecipe();
}

function showRecipeDetails(event) {
  if(event.target.className == "inactive") {
    event.target.className = "active";
    detailsBlock.className = "";
  } else {
    event.target.className = "inactive";
    detailsBlock.className = "invisible"
  };
};


//---EVENT LISTENERS---
//welcome page
setupSubmit.addEventListener("click", function(event) {
  event.preventDefault();
  hide(displayWelcome);
  show(displayRecipeSwiper);
});

//recipe block stuff
toggleMenu.addEventListener("click", function(event) {
  if(event.target.className != "") {
    if(event.target.className == "inactive") {
    event.target.className = "active";
    } else {
    event.target.className = "inactive";
    };
  };
});

//recipe card
recipeFavBtn.addEventListener("click", favRecipe);
recipeNextBtn.addEventListener("click", nextRecipe);
recipeMoreBtn.addEventListener("click", showRecipeDetails);
