document.getElementById('ingredient-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const inputElement = document.getElementById('ingredients');
    const ingredients = inputElement.value.split(',').map(ingredient => ingredient.trim().toLowerCase());

    // Retrieve selected dietary restriction, preferred cuisine, and calorie range
    const diet = document.getElementById('diet').value;
    const cuisine = document.getElementById('cuisine').value;
    const minCalories = document.getElementById('min-calories').value;
    const maxCalories = document.getElementById('max-calories').value;

    fetchRecipes(ingredients, diet, cuisine, minCalories, maxCalories);

    // Keep the input value intact
    inputElement.value = inputElement.value;
});

document.getElementById('random-recipe-button').addEventListener('click', function() {
    fetchRandomRecipe();
});

function fetchRecipes(ingredients, diet, cuisine, minCalories, maxCalories) {
   
    let url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients}&apiKey=${apiKey}&number=10`;

    // Append dietary restriction, preferred cuisine, and calorie range if selected
    if (diet) {
        url += `&diet=${diet}`;
    }
    if (cuisine) {
        url += `&cuisine=${cuisine}`;
    }
    if (minCalories) {
        url += `&minCalories=${minCalories}`;
    }
    if (maxCalories) {
        url += `&maxCalories=${maxCalories}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const recipes = data.results.map(item => ({
                id: item.id,
                name: item.title,
                image: item.image
            }));
            displayRecipes(recipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipes');
    recipeContainer.innerHTML = '';

    if (recipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
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

        const viewInstructionsLink = document.createElement('a');
        viewInstructionsLink.href = `instruction.html?id=${encodeURIComponent(recipe.id)}&name=${encodeURIComponent(recipe.name)}`;
        viewInstructionsLink.textContent = 'View Instructions';

        recipeDiv.appendChild(recipeName);
        recipeDiv.appendChild(recipeImage);
        recipeDiv.appendChild(viewInstructionsLink);

        recipeContainer.appendChild(recipeDiv);
    });
}

function fetchRandomRecipe() {
   
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const recipe = data.recipes[0];
            const randomRecipe = [{
                id: recipe.id,
                name: recipe.title,
                image: recipe.image
            }];
            displayRecipes(randomRecipe);
        })
        .catch(error => console.error('Error fetching random recipe:', error));
}