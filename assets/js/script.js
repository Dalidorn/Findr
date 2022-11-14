//---GLOBAL VARIABLES---
var user = {
  name: "",
  email: "",
  favorites: [{title: "pineapple", image: "./assets/images/Fresh-Food-Placeholder.jpg"}, {title: "apple"}, {title: "carrot"}, {title: "guava"}, {title: "apple"}, {title: "apple"}, {title: "apple"}, {title: "apple"}, {title: "apple"}],
  preferences: []
}

//storing api reply
var currentFetchData = "";

//managing email api
var selectedFavs = [];
var emailBodyContent = "";
var emailSubject = "Your Findr Recipes"

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
var breakButton = document.querySelector("#breakfast");
var lunButton = document.querySelector("#lunch");
var dinButton = document.querySelector("#dinner");
var dessButton = document.querySelector("#dessert");
var titleContainer = document.querySelector("#recipeTitle");
var linkUrl = document.getElementById("linkUrl");
var recipeImg = document.querySelector("#recipeImg");
var summary = document.querySelector("#summary");
var ingredientsli = document.querySelector("#ingredients");

//input
var usernameInput = document.querySelector("#usernameInput");
var emailInput = document.querySelector("#userEmail");
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
  if(event.target.className != "") {
      if(event.target.className == "inactive") {
    event.target.className = "active";
    } else {
    event.target.className = "inactive";
    };
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

function selectItem(event) {
  event.target.classList.toggle("selected");
  if(event.target.className == "selected") {
    console.log("selected " + event.target.textContent);
  } else {
    console.log("unselected " + event.target.textContent);
  }
};

function sendMail(name, email, subject, message) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.set('Authorization', 'Basic ' + base64.encode('79ba7f36f96cc9a660a18aa3ef398386'+":" +'6e949ee91b38ae3dc4d9609febb4a90e'));

  const data = JSON.stringify({
    "Messages": [{
      "From": {"Email": "<YOUR EMAIL>", "Name": "<YOUR NAME>"},
      "To": [{"Email": email, "Name": name}],
      "Subject": subject,
      "TextPart": message
    }]
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
  };

  fetch("https://api.mailjet.com/v3.1/send", requestOptions)
    .then(function(response){
      return response.text()
    })
    .then(function(result){
      return console.log(result)
    })
    .catch(function(error){
      console.log('error',error);
    })
};

function getSelected() {
  document.querySelectorAll(".selected").forEach(fav => {
    selectedFavs.push(user.favorites[fav.id]);
    fav.classList.toggle("selected");
  });
  console.log(selectedFavs);
  writeEmail();

};

function writeEmail() {
  emailBodyContent = `Hi ${user.name}! Thanks for using Findr! You requested the following recipes: `
  for(i=0;i<selectedFavs.length; i++) {
    emailBodyContent += selectedFavs[i].title + " - " + selectedFavs[i].sourceUrl + ". "
  };
  selectedFavs = [];
};

function fetchRecipeList() {
  var headers = {};
  var tags = [];
  var spoonURL = 'https://api.spoonacular.com/recipes/random?apiKey=cc3888f8468f4f98a6465b665303b10b&number=100&tags=';

  if (breakButton.className === "active"){
    tags.push("breakfast,");
  } else if (lunButton.className === "active"){
    tags.push("lunch,");
  } else if (dinButton.className === "active"){
    tags.push("dinner,");
  } else if (dessButton.className === "active"){
    tags.push("dessert,");
  }

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
      currentFetchData = data;
      // titleContainer.textContent = data.recipes[0].title;
      // summary.innerHTML = data.recipes[0].summary;
      // for (var i =0; i<data.recipes[0].extendedIngredients.length; i++){
      //   var list = document.createElement('li');
      //   list.innerHTML = data.recipes[0].extendedIngredients[i].original;
      //   ingredientsli.appendChild(list);
      // }
      // recipeImg.src = data.recipes[0].image;
      // console.log(data.recipes[0].spoonacularSourceUrl)
      // linkUrl.textContent = data.recipes[0].spoonacularSourceUrl
    });
};

var recipeIncr = 0;


//---RECIPE CARD FUNCTIONS---
function nextRecipe() {
  titleContainer.textContent = currentFetchData.recipes[recipeIncr].title;
  summary.innerHTML = currentFetchData.recipes[recipeIncr].summary;
  for (var i =0; i<currentFetchData.recipes[recipeIncr].extendedIngredients.length; i++){
    var list = document.createElement('li');
    list.innerHTML = currentFetchData.recipes[recipeIncr].extendedIngredients[i].original;
    ingredientsli.appendChild(list);
    }
  recipeImg.src = currentFetchData.recipes[recipeIncr].image;
  console.log(currentFetchData.recipes[recipeIncr].spoonacularSourceUrl)
  linkUrl.textContent = currentFetchData.recipes[recipeIncr].spoonacularSourceUrl
  recipeIncr ++
  // fetchRecipe()
  console.log("SHOW " + recipeIncr + "RECIPE");
};

function favRecipe() {
    // var recipes=[];
    // var recipe={
    //     ingredients:[ingredientsli[0].innerHTML,ingredientsli[1].innerHTML,ingredientsli[2].innerHTML],
    //     summary:summary.innerHTML
    // };
    // console.log(recipe);
    // recipes.push(recipe);
  // localStorage.setItem("favoriterecipes", JSON.stringify(recipes));
  console.log("FAV THIS");
  nextRecipe();
};

function showRecipeDetails() {
  if(linkUrl.className == "invisible") {
    linkUrl.className = "";
  } else {
    linkUrl.className = "invisible"
  };
};



//---DRAG AND DROP FUNCTIONALITY---
const position = { x: 0, y: 0 };

function handleDrop(event) {
  event.relatedTarget.style.transition = "transform 0.5s";
  console.log(event.relatedTarget.id + ' was dropped into ' + event.target.className)
  position.x = 0;
  position.y = 0;
  event.relatedTarget.style.transform = `translate(${position.x}px, ${position.y}px)`;
  if(event.target.className == "dropFav") {
    favRecipe();
  } else {
    nextRecipe();
  };
};

interact(".draggable").draggable({
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
});

interact(".dropFav").dropzone({
  ondrop: handleDrop,
  overlap: 0.01,
});

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
  user.email = emailInput.value;
  for(i=0; i < 5; i++) { 
    if(dietaryRestrictionToggle.children[i].children[1].checked) {
      user.preferences.push(dietaryRestrictionToggle.children[i].children[0].textContent)
    };
  };
  console.log("Username: " + user.name + " Email: " + user.email + " Preferences: " + user.preferences + " - logged.");
  resetNextDisplay(); //resets the preferences display for smaller screens if needed.  
  showRecipeSwiper(); //move into .then statement for load time and add transition screen
  fakeFetch(); // replace this with real fetch later
  recipeIncr = -1;
  nextRecipe();
};