var tags = 'italian'

var spoonURL = 'https://api.spoonacular.com/recipes/random?apiKey=cc3888f8468f4f98a6465b665303b10b&tags='+tags

var headers = {};
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




