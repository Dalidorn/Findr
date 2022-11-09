var tags = 'breakfast, dinner'
var spoonURL = 'https://api.spoonacular.com/recipes/random?apiKey=cc3888f8468f4f98a6465b665303b10b&number=100&tags='+tags
var headers = {}

function appendData(data){
  var mainContainer = document.getElementById("myData")
  for (var i=0; i<data.length; i++){
    var div = document.createElement("div")
    div.innerHTML = data[i].title
    mainContainer.appendChild(div);
  }
}

fetch(spoonURL, {
  mode: 'cors',
  method: 'GET', //GET is the default.
  headers: headers
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });


// function getParams() {
//   // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
//   var searchParamsArr = document.location.search.split('&');
  
//   // Get the query and format values
//   var query = searchParamsArr[0].split('=').pop();
//   var format = searchParamsArr[1].split('=').pop();
  
//   searchApi(query, format);
// }

// Crispy Italian Cauliflower Poppers Appetizer might be just the hor d'oeuvre you are searching for. One serving contains <b>472 calories</b>, <b>21g of protein</b>, and <b>17g of fat</b>. For <b>$2.01 per serving</b>, this recipe <b>covers 29%</b> of your daily requirements of vitamins and minerals. If you have canned tomatoes, flour, olive oil, and a few other ingredients on hand, you can make it. 84 people have tried and liked this recipe. This recipe is typical of Mediterranean cuisine. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 92%</b>. This score is spectacular. Try <a href="https://spoonacular.com/recipes/crispy-baked-cauliflower-poppers-912014">Crispy Baked Cauliflower Poppers</a>, <a href="https://spoonacular.com/recipes/crispy-shrimp-poppers-449327">Crispy Shrimp Poppers</a>, and <a href="https://spoonacular.com/recipes/cauliflower-poppers-560125">Cauliflower Poppers</a> for similar recipes.


