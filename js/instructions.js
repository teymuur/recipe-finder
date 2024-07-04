const searchParams = new URLSearchParams(window.location.search);

// Create an object to store the query parameters
const params = {};

// Iterate over the search parameters and add them to the params object
for (const [key, value] of searchParams.entries()) {
    params[key] = value;
}

const recipe = document.getElementById("recipe");
console.log(params, recipe);
document.title += " " + params['name'];
document.querySelectorAll("h1")[0].innerHTML += params['name'];

function fetchRecipeDetails(recipeId) {

    const url = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process and display recipe details as required
            if (data.length > 0) {
                const recipeDetails = data[0].steps;
                displayRecipeDetails(recipeDetails);
            } else {
                recipe.innerHTML = '<p>No instructions available for this recipe.</p>';
            }
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

function displayRecipeDetails(steps) {
    let recipeContent = '';

    steps.forEach(step => {
        recipeContent += `<h2>Step ${step.number}</h2>`;
        recipeContent += `<p>${step.step}</p>`;

        if (step.ingredients.length > 0) {
            recipeContent += '<h3>Ingredients:</h3><ul>';
            step.ingredients.forEach(ingredient => {
                recipeContent += `<li>${ingredient.name} (ID: ${ingredient.id}, Image: <img src="https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}" alt="${ingredient.name}">)</li>`;
            });
            recipeContent += '</ul>';
        }

        if (step.equipment.length > 0) {
            recipeContent += '<h3>Equipment:</h3><ul>';
            step.equipment.forEach(equipment => {
                recipeContent += `<li>${equipment.name} (ID: ${equipment.id}, Image: <img src="https://spoonacular.com/cdn/equipment_100x100/${equipment.image}" alt="${equipment.name}">)`;
                if (equipment.temperature) {
                    recipeContent += ` - Temperature: ${equipment.temperature.number} ${equipment.temperature.unit}`;
                }
                recipeContent += '</li>';
            });
            recipeContent += '</ul>';
        }

        if (step.length) {
            recipeContent += `<p>Time: ${step.length.number} ${step.length.unit}</p>`;
        }

        recipeContent += '<hr>'; // Add a horizontal line to separate steps
    });

    recipe.innerHTML = recipeContent;
}

fetchRecipeDetails(params['id']);
