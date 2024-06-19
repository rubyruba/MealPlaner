// Define the API URLs
let apiByName = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
let apiByLetter = 'https://www.themealdb.com/api/json/v1/1/search.php?f='

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
                        <button id="add-meal">See recipe</button>
                    </li>
                    `
      let li = document.createElement('li')
      li.innerHTML = markup
      li.addEventListener('click', () => {
        document.getElementById('inputSearch').value = meal.strMeal
        document.getElementById('dropdown').innerHTML = ''
        document.getElementById('inputSearch').dispatchEvent(new Event('input')) // Trigger input event to perform search
      })
      ul.appendChild(li)
    })
  } else {
    resultsDiv.innerHTML =
      "<p>Sorry, we didn't find this recipe. Please try another search.</p>"
  }
}

// Event listener for search button click
document
  .getElementById('searchButton')
  .addEventListener('click', onSearchClicked)

// Show a random meal
async function showRandom () {
  let response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php'
  )
  let data = await response.json()
  let meal = data.meals[0]
  console.log(meal.strMeal)

  let img = document.createElement('img')
  img.src = meal.strMealThumb
  img.className = 'myclass'
  document.getElementById('meal-image').appendChild(img)

  let title = document.createElement('h2')
  title.textContent = meal.strMeal
  document.getElementById('meal-info').appendChild(title)

  let category = document.createElement('p')
  category.textContent = 'category: ' + meal.strCategory
  document.getElementById('meal-info').appendChild(category)

  let myList = document.createElement('ul')
  myList.id = 'listItems'
  myList.textContent = 'ingredients: '
  document.getElementById('meal-info').appendChild(myList)
  for (let i = 1; i < 21; i++) {
    let listItem = document.createElement('li')
    if (meal['strMeasure' + i] !== '' && meal['strIngredient' + i] !== '') {
      listItem.textContent =
        meal['strMeasure' + i] + '   ' + meal['strIngredient' + i]
      myList.appendChild(listItem)
    }
  }
  document.getElementById('meal-info').appendChild(document.createElement('br'))

  let description = document.createElement('div')
  description.className = 'description'
  description.textContent = 'Description: \n' + meal.strInstructions
  document.getElementById('meal-info').appendChild(description)

  let youtubeLink = document.createElement('a')
  youtubeLink.href = meal.strYoutube
  youtubeLink.textContent = 'Instructing video on Youtube'
  document.getElementById('meal-info').appendChild(youtubeLink)
}
showRandom()

// Event listener for search input field to handle live search
let searchInput = document.getElementById('inputSearch')
searchInput.addEventListener('input', async () => {
  let searchTerm = searchInput.value.trim()
  if (searchTerm) {
    let response = await fetch(apiByName + searchTerm)
    let data = await response.json()
    displayResults(data)
  } else {
    document.getElementById('dropdown').querySelector('ul').innerHTML = ''
  }
})
