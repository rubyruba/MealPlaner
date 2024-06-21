document.getElementById('searchByTitleButton').addEventListener('click', async () => {
    let searchTerm = document.getElementById('inputSearch').value.trim();
    if (searchTerm) {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        if (response.ok) {
            let data = await response.json();
            if (data.meals) {
                let mealName = data.meals[0].strMeal;
                document.getElementById('inputSearch').value = mealName;
                console.log('Meal name found and set to input:', mealName);
                // Triggering the input event to update the search term
                searchInput.dispatchEvent(new Event('input'));
            }
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    } else {
        alert('Please enter a search term');
    }
});