// Define the API URL for searching by title
let apiByName = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

// Function to handle search button click by title
let onSearchByTitleClicked = async () => {
  let inputSearch = document.getElementById('inputSearch').value.trim()
  if (inputSearch === '') {
    alert('Please enter a recipe name')
    return
  }
  try {
    let response = await fetch(apiByName + inputSearch)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await response.json()
    displayResults(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('An error occurred while fetching the data. Please try again.')
  }
}

// Function to display search results by title
const displayResults = data => {
  const resultsDiv = document.getElementById('dropdown')
  const ul = resultsDiv.querySelector('ul')
  ul.innerHTML = '' // Clear previous results

  if (data.meals) {
    data.meals.forEach(meal => {
      let markup = `
              <li>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-img-top">
          <h3>${meal.strMeal}</h3>
          <button  id="add-meal" onclick="showRecipe('${meal.strMeal}')">See recipe</button>
        </li>
            `
      ul.insertAdjacentHTML('beforeend', markup)
    })
  } else {
    resultsDiv.innerHTML =
      "<p>Sorry, we didn't find this recipe. Please try another search.</p>"
  }
}

// Event listener for search button click by title
document
  .getElementById('searchByTitleButton')
  .addEventListener('click', onSearchByTitleClicked)
