const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["Day", "Breakfast", "Lunch", "Dinner"];

const table = document.getElementById('table');

// Create and append header row for meals
const headerRow = document.createElement('div');
headerRow.className = 'row';

for (let i = 0; i < meals.length; i++) {
    const headerMeal = document.createElement('div');
    headerMeal.className = 'header';
    headerMeal.innerText = meals[i];
    headerRow.appendChild(headerMeal);
}

table.appendChild(headerRow);

// Create and append rows for each day with empty cells
const cells = {}; // To store cell references

for (let i = 0; i < days.length; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    const dayCell = document.createElement('div');
    dayCell.className = 'cell week-name';
    dayCell.innerText = days[i];
    row.appendChild(dayCell);

    for (let j = 1; j < meals.length; j++) {
        const mealCell = document.createElement('div');
        mealCell.className = 'cell';
        mealCell.innerText = ''; // Empty cell for future use
        row.appendChild(mealCell);

        // Store reference to cells for future use
        if (!cells[days[i]]) {
            cells[days[i]] = {};
        }
        cells[days[i]][meals[j]] = mealCell;
    }

    table.appendChild(row);
}

// Event listener for pasta item
const pasta = document.getElementById('pasta');
pasta.addEventListener('click', function() {
    // Set the text content for Monday breakfast cell
    cells["Monday"]["Breakfast"].innerText = "Pasta";
});