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
