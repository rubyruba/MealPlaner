// Define the API URLs
let apiByName = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
let apiByIngredient = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';

// Function to handle search button click
let onSearchClicked = async (searchType) => {
    let inputSearch = document.getElementById('inputSearch').value.trim();
    if (inputSearch === '') {
        alert('Please enter a search term');
        return;
    }

    let apiUrl = searchType === 'title' ? apiByName + inputSearch : apiByIngredient + inputSearch;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        displayResults(data, searchType);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching the data. Please try again.');
    }
}

// Function to display search results
const displayResults = (data, searchType) => {
    const resultsDiv = document.getElementById('dropdown');
    const ul = resultsDiv.querySelector('ul');
    ul.innerHTML = ''; // Clear previous results

    if (searchType === 'title' && data.meals) {
        data.meals.forEach(meal => {
            let markup = `
                <li>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p>Food style: ${meal.strArea}</p>
                    <button class="see-recipe" data-meal-id="${meal.idMeal}">See recipe</button>
                </li>
            `;
            ul.insertAdjacentHTML('beforeend', markup);
        });
    } else if (searchType === 'ingredient' && data.meals) {
        data.meals.forEach(meal => {
            let markup = `
                <li>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button class="see-recipe" data-meal-id="${meal.idMeal}">See recipe</button>
                </li>
            `;
            ul.insertAdjacentHTML('beforeend', markup);
        });
    } else {
        resultsDiv.innerHTML = "<p>Sorry, we didn't find any recipes. Please try another search.</p>";
    }

    // Add event listeners to "See recipe" buttons
    document.querySelectorAll('.see-recipe').forEach(button => {
        button.addEventListener('click', onSeeRecipeClicked);
    });
}

// Function to handle "See recipe" button click
const onSeeRecipeClicked = async event => {
    let mealId = event.target.getAttribute('data-meal-id');
    let apiById = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        let response = await fetch(apiById);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        displayRecipeDetails(data.meals[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching the recipe details. Please try again.');
    }
}

const displayRecipeDetails = meal => {
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
            ingredientsList.push({ ingredient, measure });
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
    document.getElementById('addToTableButton').addEventListener('click', () => addToTable(meal.strMeal, ingredientsList));
};

const shoppingList = {};

const parseFraction = (fraction) => {
    const parts = fraction.split('/');
    if (parts.length === 2) {
        return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(fraction);
};

const parseMeasure = (measure) => {
    const regex = /^(\d+\s\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)\s*([a-zA-Z]*)$/;
    const match = measure.match(regex);
    if (match) {
        let amount = 0;
        if (match[1].includes(' ')) {
            // Handle mixed number (e.g., "1 1/2")
            const parts = match[1].split(' ');
            amount = parseFloat(parts[0]) + parseFraction(parts[1]);
        } else {
            amount = parseFraction(match[1]);
        }
        const unit = match[4].trim() || '';
        return { amount: amount || 0, unit: unit };
    }
    return { amount: 0, unit: measure.trim() }; // Treat measure as a unit if it doesn't match the regex
};

const addMeasures = (measure1, measure2) => {
    const parsed1 = parseMeasure(measure1);
    const parsed2 = parseMeasure(measure2);
    if (parsed1.unit === parsed2.unit) {
        return `${parsed1.amount + parsed2.amount} ${parsed1.unit}`.trim();
    } else if (!parsed1.unit || !parsed2.unit) {
        return parsed1.unit || parsed2.unit; // Use the string measure
    } else {
        return `${measure1}, ${measure2}`.trim();
    }
};

const addToTable = (mealName, ingredients) => {
    if (selectedCell) {
        selectedCell.innerText = mealName;
        selectedCell.classList.remove('selected');
        selectedCell = null;

        // Add ingredients to the shopping list
        ingredients.forEach(({ ingredient, measure }) => {
            if (shoppingList[ingredient]) {
                // If the ingredient is already in the shopping list, update the amount
                shoppingList[ingredient].measure = addMeasures(shoppingList[ingredient].measure, measure);
            } else {
                // If the ingredient is not in the shopping list, add it
                shoppingList[ingredient] = { measure };
            }
        });

        updateShoppingList();
    } else {
        alert('Please select a cell in the table first.');
    }
};

const updateShoppingList = () => {
    const shoppingListDiv = document.getElementById('shopping-list');
    shoppingListDiv.innerHTML = '';

    for (const [ingredient, { measure }] of Object.entries(shoppingList)) {
        const listItem = document.createElement('li');
        listItem.innerText = `${ingredient} - ${measure}`;
        shoppingListDiv.appendChild(listItem);
    }
};

document.getElementById('searchByTitleButton').addEventListener('click', () => onSearchClicked('title'));
document.getElementById('searchByIngredientButton').addEventListener('click', () => onSearchClicked('ingredient'));
