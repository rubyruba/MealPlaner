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
