// Define the API URLs
let apiByName = 'https://www.themealdb.com/api/json/v1/1/search.php?s='

// Function to handle search button click
let onSearchClicked = async () => {
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
    console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('An error occurred while fetching the data. Please try again.')
  }
}

// Function to display search results
const displayResults = data => {
  const resultsDiv = document.getElementById('dropdown')
  const ul = resultsDiv.querySelector('ul')
  ul.innerHTML = '' // Clear previous results

  if (data.meals) {
    data.meals.forEach(meal => {
      let markup = `
       <li>
         <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
         <h3>${meal.strMeal}</h3>
         <p> Food style: ${meal.strArea}</p>
         <button class="see-recipe" data-meal-id="${meal.idMeal}">See recipe</button>
       </li>
     `
      ul.insertAdjacentHTML('beforeend', markup)
    })

    // Add event listeners to "See recipe" buttons
    document.querySelectorAll('.see-recipe').forEach(button => {
      button.addEventListener('click', onSeeRecipeClicked)
    })
  } else {
    resultsDiv.innerHTML =
      "<p>Sorry, we didn't find this recipe. Please try another search.</p>"
  }
}

// Function to handle "See recipe" button click
const onSeeRecipeClicked = async event => {
  let mealId = event.target.getAttribute('data-meal-id')
  let apiById = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  try {
    let response = await fetch(apiById)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await response.json()
    displayRecipeDetails(data.meals[0])
  } catch (error) {
    console.error('Error fetching data:', error)
    alert(
      'An error occurred while fetching the recipe details. Please try again.'
    )
  }
}

const displayRecipeDetails = meal => {
  const mealCardDiv = document.getElementById('meal-card')
  const mealImageDiv = document.getElementById('meal-image')
  const mealInfoDiv = document.getElementById('meal-info')

  // Clear previous details
  mealCardDiv.style.display = 'block'
  mealImageDiv.innerHTML = ''
  mealInfoDiv.innerHTML = ''

  let ingredients = ''
  let ingredientsList = [] // To keep track of ingredients

  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`]
    let measure = meal[`strMeasure${i}`]
    if (ingredient) {
      ingredients += `<li>${ingredient} - ${measure}</li>`
      ingredientsList.push(`${ingredient} - ${measure}`)
    }
  }

  let imageMarkup = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
  `

  let infoMarkup = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    <button id="addToTableButton">Add to Table</button>
  `

  mealImageDiv.insertAdjacentHTML('beforeend', imageMarkup)
  mealInfoDiv.insertAdjacentHTML('beforeend', infoMarkup)

  // Add event listener to the "Add to Table" button
  document
    .getElementById('addToTableButton')
    .addEventListener('click', () => addToTable(meal.strMeal, ingredientsList))
}
const shoppingList = []

const addToTable = (mealName, ingredients) => {
  if (selectedCell) {
    selectedCell.innerText = mealName
    selectedCell.classList.remove('selected')
    selectedCell = null

    // Add ingredients to the shopping list
    ingredients.forEach(ingredient => {
      if (ingredient) {
        shoppingList.push(ingredient)
      }
    })

    updateShoppingList()
  } else {
    alert('Please select a cell in the table first.')
  }
}

const updateShoppingList = () => {
  const shoppingListDiv = document.getElementById('shopping-list')
  shoppingListDiv.innerHTML = ''

  const uniqueIngredients = Array.from(new Set(shoppingList))
  uniqueIngredients.forEach(ingredient => {
    const listItem = document.createElement('li')
    listItem.innerText = ingredient
    shoppingListDiv.appendChild(listItem)
  })
}

document
  .getElementById('searchButton')
  .addEventListener('click', onSearchClicked)
