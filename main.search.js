// Define the API URLs
console.log("hey");
let apiByName = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let apiByLetter = "https://www.themealdb.com/api/json/v1/1/search.php?f=";
let onSearchClicked = async () => {
  let inputSearch = document.getElementById("inputSearch").value;
  if (inputSearch === "") {
    alert("Add a name");
    return;
  }
  let response = await fetch(apiByName + inputSearch);
  console.log("respons", response);
  if (response.ok) {
    let data = await response.json();
    console.log(data);
    displayResults(data);
  } else {
    console.error("Network response was not ok " + response.statusText);
    alert("An error occurred while fetching the data. Please try again.");
  }
};
const displayResults = (data) => {
  const resultsDiv = document.getElementById("table");
  resultsDiv.innerHTML = ""; // Clear previous results
  if (data.meals) {
    data.meals.forEach((meal) => {
      let mealDiv = document.createElement("div");
      mealDiv.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <p>${meal.strInstructions}</p>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="200">
              `;
      resultsDiv.appendChild(mealDiv);
    });
  } else {
    resultsDiv.innerHTML = "<p>No results found</p>";
  }
};

document
  .getElementById("searchButton")
  .addEventListener("click", onSearchClicked);

/*let apiByName = "www.themealdb.com/api/json/v1/1/search.php?s=";*/
/*let apiByLetter = "www.themealdb.com/api/json/v1/1/search.php?f=";*/

/*let onSearchClicked = async () => {
          let foodName = document.getElementById("inputSearch").value;
          let response = await fetch(
            "www.themealdb.com/api/json/v1/1/search.php?s=" + foodName
          );
          let inputSearch = document.getElementById("inputSearch").value;
          if (inputSearch === "") {
            return alert("Add a name");
          }
          let data = await response.json();
          console.log(data);
          let results = await searchRecipeByIngredient(inputSearch);
        };

        let getRecipe = async () => {
          let apiByName = await fetch();
        };*/
