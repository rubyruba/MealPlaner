async function showRandom() {
  let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  let data = await response.json();
  let meal = data.meals[0];
  console.log(meal.strMeal);

  displayMeal(meal);
}
showRandom();
async function showRecipe(mealName) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
  let data = await response.json();
  let meal = data.meals[0];
 
  displayMeal(meal);

}

function displayMeal(meal) {
  // Clear previous content
  document.getElementById('meal-image').innerHTML = '';
  document.getElementById('meal-info').innerHTML = '';

  let img = document.createElement('img');
  img.src = meal.strMealThumb;
  img.className = 'myclass';
  document.getElementById('meal-image').appendChild(img);

  let title = document.createElement('h2');
  title.textContent = meal.strMeal;
  document.getElementById('meal-info').appendChild(title);

  let category = document.createElement('p');
  category.textContent = 'Category: ' + meal.strCategory;
  document.getElementById('meal-info').appendChild(category);

  let myList = document.createElement('ul');
  myList.id = 'listItems';
  myList.textContent = 'Ingredients:';
  document.getElementById('meal-info').appendChild(myList);

  let ingredients = [];
  for (let i = 1; i < 21; i++) {
    if (meal['strMeasure' + i] && meal['strIngredient' + i]) {
      let listItem = document.createElement('li');
      listItem.textContent = meal['strMeasure' + i] + ' ' + meal['strIngredient' + i];
      myList.appendChild(listItem);

      ingredients.push({
        measure: meal['strMeasure' + i],
        ingredient: meal['strIngredient' + i]
      });
    }
  }

  let description = document.createElement('div');
  description.className = 'description';
  description.textContent = 'Description: ' + meal.strInstructions;
  document.getElementById('meal-info').appendChild(description);

  let youtubeLink = document.createElement('a');
  youtubeLink.href = meal.strYoutube;
  youtubeLink.textContent = 'Instructing video on YouTube';
  document.getElementById('meal-info').appendChild(youtubeLink);

  // Add event listener for "Add to planner" button
  document.getElementById('addToTableButton').onclick = () => {
    addToTable(meal.strMeal, ingredients);
  };
}



// Make showRecipe globally accessible
window.showRecipe = showRecipe;
