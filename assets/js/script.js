//---GLOBAL VARIABLES---
var user = {
  name: "",
  favorites: [{title: "banana"}, {title: "apple"}, {title: "carrot"}, {title: "guava"}],
  preferences: []
}

var selectedFavs = [];

var currentFetchData = "";

//---ELEMENT SELECTORS---
//decorative
var decorativeCards = document.querySelectorAll("card.decorative");

//buttons
var setupNextBtn = document.querySelector("#setupNext");
var setupSubmitBtn = document.querySelector("#setupSubmit");
var favLinkBtn = document.querySelector("#favLink");
var editDPBtn = document.querySelector("#editDP");
var editDP2Btn = document.querySelector("#editDP2");
var recLinkBtn = document.querySelector("#recLink");
var emailBtn = document.querySelector("#emailBtn");

//pages
var displayPref = document.querySelector(".displayPref");
var displayWelcome = document.querySelector(".displayWelcome");
var displayRecipeSwiper = document.querySelector(".displayRecipeSwiper");
var displayFavorites = document.querySelector(".displayFavorites");
var detailsBlock = document.querySelector("#detailsBlock");
var recipeCard = document.querySelector("#recipeDisplay");
var favDisplayBlock = document.querySelector(".favDisplay");
var displayDietaryPref = document.querySelector(".displayRestrictions");
var displayInputSetup = document.querySelector(".displaySetup");
var displayMealTypes = document.querySelector(".mealTypes");

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

//input
var usernameInput = document.querySelector("#usernameInput");
var dietaryRestrictionToggle = document.querySelector(".dietaryRestrictions");


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
  if(event.target.className == "inactive") {
  event.target.className = "active";
  } else {
  event.target.className = "inactive";
  };
};

//---PAGE DISPLAY FUNCTIONS---
function handleNext() {
  if(window.getComputedStyle(displayInputSetup).display == "flex") {
    displayInputSetup.style.display = "none";
    displayDietaryPref.style.display = "flex";
  } else {
    displayDietaryPref.style.display = "none"
    displayMealTypes.style.display = "flex";
    setupNextBtn.style.display = "none";
    setupSubmitBtn.style.display = "inline-block";
  };
};

function showWelcomePage() {
  hide(displayRecipeSwiper);
  hide(displayFavorites);
  show(displayPref);
};

function showRecipeSwiper() {
  hide(displayPref);
  hide(displayFavorites);
  show(displayRecipeSwiper);
};

function showFavoritesPage() {
  hide(displayRecipeSwiper);
  hide(displayPref);
  for(i=0; i<user.favorites.length; i++) {
    tempCard = document.createElement("card");
    tempCard.innerHTML = user.favorites[i].title;
    tempCard.style = "background-color: red;";
    tempCard.id = i;
    tempCard.addEventListener("click", selectItem);
    favDisplayBlock.appendChild(tempCard);
  }
  show(displayFavorites);
};

function selectItem(event) {
  event.target.classList.toggle("selected");
  if(event.target.className == "selected") {
    console.log("selected " + event.target.textContent);
  } else {
    console.log("unselected " + event.target.textContent);
  }
};

function getSelected() {
  document.querySelectorAll(".selected").forEach(fav => selectedFavs.push(user.favorites[fav.id]));
  console.log(selectedFavs);
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
      console.log(data);
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
  // fetchRecipe()
  console.log("SHOW " + recipeIncr + "RECIPE");
};

function 6() {
    var recipes=[]
    var recipe={
        ingredients:[ingredientsli[0].innerHTML,ingredientsli[1].innerHTML,ingredientsli[2].innerHTML],
        summary:summary.innerHTML
    }
    console.log(recipe)
    console.log(ingredientsli)
    recipes.push(recipe)
    console.log(user)
  //TODO: Add code to save the currently displayed recipe to local storage. Store entire recipe from get request so we can access those details later.
  localStorage.setItem("local data", JSON.stringify(user));
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
      favRecipe();
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
      nextRecipe();
    },
    overlap: 0.01,
  });

//---EVENT LISTENERS---
//welcome page
setupNextBtn.addEventListener("click", handleNext)
setupSubmitBtn.addEventListener("click", handleSubmit);

//recipe card meal type restrictor
toggleMenu.addEventListener("click", toggleActive);

//recipe card effects
recipeCard.addEventListener("dblclick", showRecipeDetails);

//recipe page nav
favLinkBtn.addEventListener("click", showFavoritesPage);
editDPBtn.addEventListener("click", showWelcomePage);

//favorites
sortFavMenu.addEventListener("click", toggleActive);
emailBtn.addEventListener("click", getSelected);

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
};

function resetNextDisplay() {
  if(window.getComputedStyle(displayDietaryPref).display == "none") {
    displayDietaryPref.style.display = "flex"
    displayMealTypes.style.display = "none";
    setupNextBtn.style.display = "inline-block";
    setupSubmitBtn.style.display = "none";
  }
};


function handleSubmit(event) {
  event.preventDefault();
  user.name = usernameInput.value;
  console.log(user.name);
  for(i=0; i < 5; i++) { 
    if(dietaryRestrictionToggle.children[i].children[1].checked) {
      user.preferences.push(dietaryRestrictionToggle.children[i].children[0].textContent)
    };
  };
  console.log(user.preferences);
  resetNextDisplay(); //resets the preferences display for smaller screens if needed.  
  showRecipeSwiper(); //move into .then statement for load time and add transition screen
  fakeFetch(); // replace this with real fetch later
}