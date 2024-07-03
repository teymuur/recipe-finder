document.getElementById('ingredient-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const input = document.getElementById('ingredients').value;
    const ingredients = input.split(',').map(ingredient => ingredient.trim().toLowerCase());
    fetchRecipes(ingredients);
});

function fetchRecipes(ingredients) {

    const query = ingredients.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=10&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const recipes = data.map(item => ({
                name: item.title,
                image: item.image,
                ingredients: item.usedIngredients.map(ing => ing.name)
            }));
            displayRecipes(recipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML += '';

    if (recipes.length === 0) {
        recipeContainer.innerHTML += '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        
        const recipeName = document.createElement('h2');
        recipeName.textContent = recipe.name;

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.name;

        recipeDiv.appendChild(recipeName);
        recipeDiv.appendChild(recipeImage);
        recipeContainer.appendChild(recipeDiv);
    });
}
