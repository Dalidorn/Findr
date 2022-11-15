//---GLOBAL VARIABLES---
var user = {
  name: "",
  email: "",
  favorites: [],
  preferences: []
};

//storing api reply
var currentFetchData = JSON.parse(localStorage.getItem("Response"));

//incrementer number for current recipe
var recipeIncr = 0;

//managing email api
var selectedFavs = [];
var emailBodyContent = "";
var emailSubject = "Your Findr Recipes"

//---ELEMENT SELECTORS---
//decorative
var decorativeCards = document.querySelectorAll(".decorative");

//buttons
var setupNextBtn = document.querySelector("#setupNext");
var setupSubmitBtn = document.querySelector("#setupSubmit");
var favLinkBtn = document.querySelector("#favLink");
var editDPBtn = document.querySelector("#editDP");
var editDP2Btn = document.querySelector("#editDP2");
var recLinkBtn = document.querySelector("#recLink");
var emailBtn = document.querySelector("#emailBtn");
var breakButton = document.querySelector("#breakfast");
var lunButton = document.querySelector("#lunch");
var dinButton = document.querySelector("#dinner");
var dessButton = document.querySelector("#dessert");

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

//input
var usernameInput = document.querySelector("#usernameInput");
var emailInput = document.querySelector("#userEmail");
var dietaryRestrictionToggle = document.querySelector(".dietaryRestrictions");
var toggleMenu = document.querySelector("#toggleMenu");

//output
var titleContainer = document.querySelector("#recipeTitle");
var ingrContainer = document.getElementById("detailsBlock");
var recipeImg = document.querySelector("#recipeImg");
var ingredientsli = document.querySelector("#ingredients");
var summary = document.querySelector("#summary");


//---LOCAL STORAGE CHECK---
if(localStorage.getItem("local storage")) {
  user = JSON.parse(localStorage.getItem("local storage"));
  usernameInput.value = user.name
  emailInput.value = user.email
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

//shows the landing page
function showWelcomePage() {
  hide(displayRecipeSwiper);
  hide(displayFavorites);
  show(displayPref);
};

//shows the main recipe swiper
function showRecipeSwiper() {
  hide(displayPref);
  hide(displayFavorites);
  show(displayRecipeSwiper);
};

//shows the favorites page and renders the saved favs onto it
function showFavoritesPage() {
  hide(displayRecipeSwiper);
  hide(displayPref);
  while(favDisplayBlock.firstChild) {
    favDisplayBlock.removeChild(favDisplayBlock.firstChild);
  };
  for(i=0; i<user.favorites.length; i++) {
    tempCard = document.createElement("card");
    tempCard.innerHTML = user.favorites[i].title;
    tempCard.style = `background-image: url(${user.favorites[i].image});`;
    tempCard.id = i;
    tempCard.addEventListener("click", selectItem);
    favDisplayBlock.appendChild(tempCard);
  }
  show(displayFavorites);
};

//handles the next button for the landing page if needed when on smaller screens
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

//will reset the landing page to the sliders screen for smaller screens
function resetNextDisplay() {
  if(window.getComputedStyle(displayDietaryPref).display == "none") {
    displayDietaryPref.style.display = "flex"
    displayMealTypes.style.display = "none";
    setupNextBtn.style.display = "inline-block";
    setupSubmitBtn.style.display = "none";
  }
};

//handles the landing page submit button
function handleSubmit(event) {
  event.preventDefault();
  //gathers input into user object
  user.name = usernameInput.value;
  user.email = emailInput.value;
  for(i=0; i < 5; i++) { 
    if(dietaryRestrictionToggle.children[i].children[1].checked) {
      user.preferences.push(dietaryRestrictionToggle.children[i].children[0].textContent)
    };
  };
  // console.log("Username: " + user.name + " Email: " + user.email + " Preferences: " + user.preferences + " - logged.");
  resetNextDisplay();
  //resets recipe incr
  recipeIncr = -1;
  fetchRecipeList();
};

//---FAVORITES PAGE FUNCTIONS---
//toggles style and class for selected items
function selectItem(event) {
  event.target.classList.toggle("selected");
  if(event.target.className == "selected") {
    console.log("selected " + event.target.textContent);
  } else {
    console.log("unselected " + event.target.textContent);
  }
};

//gathers selected items and calls the write email function on them
function getSelected() {
  document.querySelectorAll(".selected").forEach(fav => {
    selectedFavs.push(user.favorites[fav.id]);
    fav.classList.toggle("selected");
  });
  console.log(selectedFavs);
  writeEmail();
};

//email api prework, composing the email
function writeEmail() {
  emailBodyContent = `Hi ${user.name}! Thanks for using Findr! You requested the following recipes: `
  for(i=0;i<selectedFavs.length; i++) {
    emailBodyContent += selectedFavs[i].title + " - " + selectedFavs[i].sourceUrl + ". "
  };
  selectedFavs = [];
  sendEmail(user.email, emailBodyContent);
};

//email api fetch function
function sendEmail(email, body) {
  //setting the request parameters into the data var
  var data = {
    service_id: "service_5h2t5mj",
    template_id: "template_m74lv1q",
    user_id: "CcaE2rPf19cvPouZ5",
    template_params: {
      'userEmail': email,
      'message': body
    }
  };

  //sending the POST request to the api endpoint, and attaching the options including the data var
  fetch("https://api.emailjs.com/api/v1.0/email/send", {
    mode: 'cors',
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-Type": 'application/json'}
  })
  //only console logging the response for error detection since we're not expecting a response for user display
  .then(function(response){
    console.log(response.json());
  });
};

//---RECIPE CARD FUNCTIONS---
//fetch request for 100 recipes with user's tags
function fetchRecipeList() {
  var headers = {};
  var tags = [];
  //starting URL
  var spoonURL = 'https://api.spoonacular.com/recipes/random?apiKey=cc3888f8468f4f98a6465b665303b10b&number=100&tags=';
  
  //checking the user's meal type buttons
  if (breakButton.className === "active"){
    tags.push("breakfast,")
  } else if (lunButton.className === "active"){
    tags.push("lunch,")
  } else if (dinButton.className === "active"){
    tags.push("dinner,")
  } else if (dessButton.className === "active"){
    tags.push("dessert")
  };

  //checking the user's dietary restrictions buttons
  if (document.getElementById("vegan").checked === true){
    tags.push("vegan,");
  } else if (document.getElementById("vegetarian").checked === true){
    tags.push("vegetarian,");
  } else if (document.getElementById("dairyFree").checked === true){
    tags.push("dairy-free,");
  } else if (document.getElementById("glutenFree").checked === true){
    tags.push("gluten-free,");
  } else if (document.getElementById("keto").checked === true){
    tags.push("keto,");
  };

  //adding the tags to the base URL
  for (var i=0; i<tags.length; i++){
    spoonURL = spoonURL + tags[i]
  };
  
  //start of fetch
  fetch(spoonURL, {
    mode: 'cors',
    method: 'GET',
    headers: headers
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      //saves 100 results for later
      currentFetchData = data;
      //displays recipe swiper once response is ready
      showRecipeSwiper();
      //calls next recipe to show the first recipe in data
      nextRecipe();
    });
};

//displays the next recipe to the card when called
function nextRecipe() {
  recipeIncr ++
  //removes current recipe ingredients
  while(ingredientsli.firstChild) {
    ingredientsli.removeChild(ingredientsli.firstChild);
  };
  //if we're out of recipes, gives a warning
  if(currentFetchData.recipes[recipeIncr] == null) {
    titleContainer.textContent = "Out of Recipes! Please change your preferences to see more!"
    recipeImg.src = "";
    summary.innerHTML = "N/A";
  } else {
    //reassigns text of corresponding sections 
    titleContainer.textContent = currentFetchData.recipes[recipeIncr].title;
    summary.innerHTML = currentFetchData.recipes[recipeIncr].summary;
    recipeImg.src = currentFetchData.recipes[recipeIncr].image;
    //loops to add list items for each ingredient
    for (var i =0; i<currentFetchData.recipes[recipeIncr].extendedIngredients.length; i++){
      var list = document.createElement('li');
      list.innerHTML = currentFetchData.recipes[recipeIncr].extendedIngredients[i].original;
      ingredientsli.appendChild(list);
    };
  // console.log("SHOW " + recipeIncr + " RECIPE");
  };
};

//handles favoriting a recipe and then calls next function
function favRecipe() {
  user.favorites.push(currentFetchData.recipes[recipeIncr]);
  localStorage.setItem("local storage", JSON.stringify(user));
  console.log(user.favorites);
  nextRecipe();
};

//handles showing/hiding the recipe details when called
function showRecipeDetails() {
  if(detailsBlock.className == "invisible") {
    detailsBlock.className = "";
  } else {
    detailsBlock.className = "invisible"
  };
};

//---DRAG AND DROP FUNCTIONALITY---
//establishing starting position
const position = { x: 0, y: 0 };

//function to be called on drop in box
function handleDrop(event) {
  // console.log(event.relatedTarget.id + ' was dropped into ' + event.target.className)
  //resets position to 0/0
  position.x = 0;
  position.y = 0;
  //sets transition when pulled back to center
  event.relatedTarget.style.transition = "transform 0.5s";
  event.relatedTarget.style.transform = `translate(${position.x}px, ${position.y}px)`;
  //determines which function to call based on what box it was dropped in
  if(event.target.className == "dropFav") {
    favRecipe();
  } else {
    nextRecipe();
  };
};

//interact.js event listener for recipe card - class draggable
interact(".draggable").draggable({
  listeners: {
    //listens for starting the move
    start (event) {
      // console.log(event.type)
      //removes the transition time from the reset animation
      event.target.style.transition = "";
    },
    //listens to the movement
    move (event) {
      //tracks where it should be positioned on page and set the cords
      position.x += event.dx
      position.y += event.dy
      //translates to those cords as movement occurs
      event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
    },
  },
  modifiers: [
    //restricts the movement into the parent section of the card
    interact.modifiers.restrictRect({
      restriction: 'parent'
    })
  ],
});

//event listener for the favorite dropzone
interact(".dropFav").dropzone({
  ondrop: handleDrop,
  overlap: 0.01,
});

//event listener for the next dropzone
interact(".dropNext").dropzone({
  ondrop: handleDrop,
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
emailBtn.addEventListener("click", getSelected);

//favorites page nav
editDP2Btn.addEventListener("click", showWelcomePage);
recLinkBtn.addEventListener("click", showRecipeSwiper);


//Calls welcome page on load to ensure refresh brings user to home page
showWelcomePage();