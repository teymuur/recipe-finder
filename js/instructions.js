const params = new URLSearchParams(window.location.search)
var value = "";
for (const param of params) {
  value = param;
}
recipe =  document.getElementById("recipe");
console.log(value,recipe);
document.title += " " +value;
document.querySelectorAll("h1")[0].innerHTML += value

function fetchRecipeDetails(recipeId) {

  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          recipe.innerHTML = data;
          // Extract instructions and other relevant data as needed
          const instructions = data.instructions;
          const ingredients = data.extendedIngredients.map(ingredient => ingredient.original);
          // Process and display recipe details as required
      })
      .catch(error => console.error('Error fetching recipe details:', error));
}
fetchRecipeDetails(value)