function onSeeRecipeClicked(event) {
    let mealId = event.target.getAttribute('data-meal-id');
    let apiById = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    fetchRecipeDetails(apiById);
}

function fetchRecipeDetails(apiUrl) {
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            displayRecipeDetails(data.meals[0]);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching the recipe details. Please try again.');
        });
}

function displayRecipeDetails(meal) {
    const mealCardDiv = document.getElementById('meal-card');
    const mealImageDiv = document.getElementById('meal-image');
    const mealInfoDiv = document.getElementById('meal-info');

    // Clear previous details
    mealCardDiv.style.display = 'flex';
    mealImageDiv.innerHTML = '';
    mealInfoDiv.innerHTML = '';

    let ingredients = '';
    let ingredientsList = []; // To keep track of ingredients

    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
            ingredientsList.push({ ingredient: ingredient, measure: measure });
        }
    }

    let imageMarkup = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    `;

    let infoMarkup = `
        <h2>${meal.strMeal}</h2>
        <p>Category: ${meal.strCategory}</p>
        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>
        <h3>Description</h3>
        <p>${meal.strInstructions}</p>
        <div class="button-container">
            <a href="https://www.youtube.com" target="_blank" class="instruction-video">Instruction video on Youtube</a>
            <button id="addToTableButton">Add to planner</button>
        </div>
    `;

    mealImageDiv.insertAdjacentHTML('beforeend', imageMarkup);
    mealInfoDiv.insertAdjacentHTML('beforeend', infoMarkup);

    // Add event listener to the "Add to Table" button
    document.getElementById('addToTableButton').addEventListener('click', function () {
        addToTable(meal.strMeal, ingredientsList);
    });
}
