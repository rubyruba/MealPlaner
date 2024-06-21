let apiByIngredient = 'https://www.themealdb.com/api/json/v1/1/filter.php?i='

let onSearchByIngredientClicked = async () => {
  let inputSearch = document.getElementById('inputSearch').value.trim()
  if (inputSearch === '') {
    alert('Please enter an ingredient')
    return
  }
  try {
    let response = await fetch(apiByIngredient + inputSearch)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    let data = await response.json()
    displayIngredientResults(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('An error occurred while fetching the data. Please try again.')
  }
}

const displayIngredientResults = data => {
  const items = document.getElementById('items')
  items.innerHTML = '' // Clear previous results

  if (data.meals) {
    document.getElementById('msg').style.display = 'none'
    data.meals.forEach(meal => {
      let itemDiv = document.createElement('div')
      console.log('meal', meal)
      itemDiv.className = 'm-2 singleItem'

      itemDiv.setAttribute('onclick', `showRecipe('${meal.strMeal}')`)
      let itemInfo = `
           
                <li>
          <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
          <div class="card-body text-center">
            <h3>${meal.strMeal}</h3>
            <button  id="add-meal" onclick="showRecipe('${meal.strMeal}')">See recipe</button>
          </div>
        </li>
           
            `
      itemDiv.innerHTML = itemInfo
      items.appendChild(itemDiv)
    })
  } else {
    document.getElementById('msg').style.display = 'block'
  }
}

// Event listener for search button click by ingredient
document
  .getElementById('searchByIngredientButton')
  .addEventListener('click', onSearchByIngredientClicked)
