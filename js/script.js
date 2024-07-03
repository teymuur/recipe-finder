document.getElementById('ingredient-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const inputElement = document.getElementById('ingredients');
    const ingredients = inputElement.value.split(',').map(ingredient => ingredient.trim().toLowerCase());

    // Retrieve selected dietary restriction and preferred cuisine
    const diet = document.getElementById('diet').value;
    const cuisine = document.getElementById('cuisine').value;

    fetchRecipes(ingredients, diet, cuisine);

    // Keep the input value intact
    inputElement.value = input;
});

function fetchRecipes(ingredients, diet, cuisine) {

    let url = ` https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${ingredients}&apiKey=${apiKey}`;

    // Append dietary restriction and preferred cuisine if selected
    if (diet) {
        url += `&diet=${diet}`;
    }
    if (cuisine) {
        url += `&cuisine=${cuisine}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('API response is not an array');
            }
            const recipes = data.map(item => ({
                id: item.id,
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
        viewInstructionsLink.href = `instruction.html?f=${encodeURIComponent(recipe.name)}`;
        viewInstructionsLink.textContent = 'View Instructions';
        viewInstructionsLink.target = '_blank'; // Open in a new tab

        recipeDiv.appendChild(recipeName);
        recipeDiv.appendChild(recipeImage);
        recipeDiv.appendChild(viewInstructionsLink);

        recipeContainer.appendChild(recipeDiv);
    });
}
