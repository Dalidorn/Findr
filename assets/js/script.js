//---GLOBAL VARIABLES---
var user = {
  username: ""
}

//---ELEMENT SELECTORS---
//decorative
var decorativeCards = document.querySelectorAll("card.decorative");
console.log(decorativeCards);

//buttons
var setupSubmitBtn = document.querySelector("#setupSubmit");
var recipeFavBtn = document.querySelector("#recipeFav");
var recipeNextBtn = document.querySelector("#recipeNext");
var favLinkBtn = document.querySelector("#favLink");
var editDPBtn = document.querySelector("#editDP");
var editDP2Btn = document.querySelector("#editDP2");
var recLinkBtn = document.querySelector("#recLink");

//pages
var displayPref = document.querySelector(".displayPref");
var displayWelcome = document.querySelector(".displayWelcome");
var displayRecipeSwiper = document.querySelector(".displayRecipeSwiper");
var displayFavorites = document.querySelector(".displayFavorites");
var detailsBlock = document.querySelector("#detailsBlock");
var recipeCard = document.querySelector("#recipeDisplay");

//nav menus
var toggleMenu = document.querySelector("#toggleMenu");
var sortFavMenu = document.querySelector("#sortFav");
var breakButton = document.querySelector("#breakfast");
var lunButton = document.querySelector("#lunch");
var dinButton = document.querySelector("#dinner");
var dessButton = document.querySelector("#dessert");
var titleContainer = document.querySelector("#recipeTitle");
var ingrContainer = document.getElementById("detailsBlock");
var recipeImg = document.querySelector("#recipeImg");
var summary = document.querySelector("#summary");
var ingredientsli = document.querySelector("#ingredients");

//input fields
var usernameInput = document.querySelector("#usernameInput");

//---LOCAL STORAGE CHECK---
if(localStorage) {
  //potential to show a modal if local storage is detected for easy clearing.
  //TODO: Add code for what to do if the user already has stored data.
};

//---GENERAL FUNCTIONS---
function hide(variable) {
  variable.style = "display: none;";
};

function show(variable) {
  variable.style = "";
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
  hide(displayRecipeSwiper);
  hide(displayFavorites)
  show(displayPref);
};

function showRecipeSwiper() {
  hide(displayPref);
  hide(displayFavorites)
  show(displayRecipeSwiper);
};

function showFavoritesPage() {
  hide(displayRecipeSwiper);
  hide(displayRecipeSwiper)
  show(displayFavorites);
};

function fetchRecipeList (){
  var headers = {};
  var tags = [];
  var spoonURL = 'https://api.spoonacular.com/recipes/random?apiKey=cc3888f8468f4f98a6465b665303b10b&number=100&tags=';

  if (breakButton.className === "active"){
    tags.push("breakfast,")
  } else if (lunButton.className === "active"){
    tags.push("lunch,")
  } else if (dinButton.className === "active"){
    tags.push("dinner,")
  } else if (dessButton.className === "active"){
    tags.push("dessert")
  }

  for (var i=0; i<tags.length; i++){
    spoonURL = spoonURL + tags[i]
  }
  
  fetch(spoonURL, {
    mode: 'cors',
    method: 'GET',
    headers: headers
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data + "OH SHIT IT PULLED AGAIN");
      titleContainer.textContent = data.recipes[0].title;
      summary.innerHTML = data.recipes[0].summary;
      for (var i =0; i<data.recipes[0].extendedIngredients.length; i++){
        var list = document.createElement('li');
        list.innerHTML = data.recipes[0].extendedIngredients[i].original;
        ingredientsli.appendChild(list);
      }
      recipeImg.src = data.recipes[0].image;
      console.log(data.recipes[0].spoonacularSourceUrl)
    });
};

var recipeIncr = 0;


//---RECIPE CARD FUNCTIONS---
function nextRecipe() {
  recipeIncr ++
  fetchRecipe()
};

function favRecipe() {
    var recipes=[]
    var recipe={
        ingredients:[ingredientsli[0].innerHTML,ingredientsli[1].innerHTML,ingredientsli[2].innerHTML],
        summary:summary.innerHTML
    }
    console.log(recipe)
    recipes.push(recipe)
  //TODO: Add code to save the currently displayed recipe to local storage. Store entire recipe from get request so we can access those details later.
  localStorage.setItem("favoriterecipes", JSON.stringify(recipes));
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
const position = { x: 0, y: 0 };
var object = interact(".draggable");


object.draggable({
  listeners: {
    start (event) {
      console.log(event.type)
      event.target.style.transition = "";
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  },
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent'
    })
  ],
})

interact(".dropFav")
  .dropzone({
    ondrop: function (event) {
      event.relatedTarget.style.transition = "transform 0.5s";
      console.log(event.relatedTarget.id + ' was dropped into ' + event.target.className)
      position.x = 0;
      position.y = 0;
      event.relatedTarget.style.transform = `translate(${position.x}px, ${position.y}px)`;
    },
    overlap: 0.01,
  });

interact(".dropNext")
  .dropzone({
    ondrop: function (event) {
      event.relatedTarget.style.transition = "transform 0.5s";
      console.log(event.relatedTarget.id + ' was dropped into ' + event.target.className)
      position.x = 0;
      position.y = 0;
      event.relatedTarget.style.transform = `translate(${position.x}px, ${position.y}px)`;
    },
    overlap: 0.01,
  });

//---EVENT LISTENERS---
//welcome page
setupSubmitBtn.addEventListener("click", handleSubmit);

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

showWelcomePage();

function fakeFetch() {
  var data = JSON.parse(localStorage.getItem("Response"));
  titleContainer.textContent = data.recipes[0].title;
  summary.innerHTML = data.recipes[0].summary;
  for (var i =0; i<data.recipes[0].extendedIngredients.length; i++){
    var list = document.createElement('li');
    list.innerHTML = data.recipes[0].extendedIngredients[i].original;
    ingredientsli.appendChild(list);
  }
  recipeImg.src = data.recipes[0].image;
  console.log(data.recipes[0].spoonacularSourceUrl)

  console.log(localStorage.getItem("Response"));
};


function handleSubmit(event) {
event.preventDefault();
  user.username = usernameInput.value;
  console.log(user.username);
  showRecipeSwiper(); //move into .then statement for load time and add transition screen
  fakeFetch();
}