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

        // Add click event listener to each cell
        mealCell.addEventListener('click', () => {
            selectCell(days[i], meals[j]);
        });

        // Store reference to cells for future use
        if (!cells[days[i]]) {
            cells[days[i]] = {};
        }
        cells[days[i]][meals[j]] = mealCell;
    }

    table.appendChild(row);
}

let selectedCell = null;

const selectCell = (day, mealTime) => {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = cells[day][mealTime];
    selectedCell.classList.add('selected');
};

const shoppingList = {};

function parseFraction(fraction) {
    const parts = fraction.split('/');
    if (parts.length === 2) {
        return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return parseFloat(fraction);
}

function parseMeasure(measure) {
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
}

function addMeasures(measure1, measure2) {
    const parsed1 = parseMeasure(measure1);
    const parsed2 = parseMeasure(measure2);
    if (parsed1.unit === parsed2.unit) {
        return `${parsed1.amount + parsed2.amount} ${parsed1.unit}`.trim();
    } else if (!parsed1.unit || !parsed2.unit) {
        return parsed1.unit || parsed2.unit; // Use the string measure
    } else {
        return `${measure1}, ${measure2}`.trim();
    }
}

function addToTable(mealName, ingredients) {
    if (selectedCell) {
        selectedCell.innerText = mealName;
        selectedCell.classList.remove('selected');
        selectedCell = null;

        // Add ingredients to the shopping list
        for (let i = 0; i < ingredients.length; i++) {
            let ingredient = ingredients[i].ingredient;
            let measure = ingredients[i].measure;
            if (shoppingList[ingredient]) {
                // If the ingredient is already in the shopping list, update the amount
                shoppingList[ingredient].measure = addMeasures(shoppingList[ingredient].measure, measure);
            } else {
                // If the ingredient is not in the shopping list, add it
                shoppingList[ingredient] = { measure: measure };
            }
        }

        updateShoppingList();
    } else {
        alert('Please select a cell in the table first.');
    }
}

function updateShoppingList() {
    const shoppingListDiv = document.getElementById('shopping-list');
    shoppingListDiv.innerHTML = '';

    for (const ingredient in shoppingList) {
        if (shoppingList.hasOwnProperty(ingredient)) {
            const listItem = document.createElement('li');
            listItem.innerText = `${ingredient} - ${shoppingList[ingredient].measure}`;
            shoppingListDiv.appendChild(listItem);
        }
    }
}

// Ensure the table and shopping list logic runs after the page loads
window.onload = () => {
    // Your table and shopping list initialization code here
};