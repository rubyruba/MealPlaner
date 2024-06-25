const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]
  const meals = ['Day', 'Breakfast', 'Lunch', 'Dinner']
  const table = document.getElementById('table')
  
  // Create and append header row for meals
  const headerRow = document.createElement('div')
  headerRow.className = 'row'
  
  for (var i = 0; i < meals.length; i++) {
    const headerMeal = document.createElement('div')
    headerMeal.className = 'header'
    headerMeal.innerText = meals[i]
    headerRow.appendChild(headerMeal)
  }
  
  table.appendChild(headerRow)
  
  const cells = {} // To store cell references
  
  for (var i = 0; i < days.length; i++) {
    const row = document.createElement('div')
    row.className = 'row'
  
    const dayCell = document.createElement('div')
    dayCell.className = 'cell week-name'
    dayCell.innerText = days[i]
    row.appendChild(dayCell)
  
    for (var j = 1; j < meals.length; j++) {
      const mealCell = document.createElement('div')
      mealCell.className = 'cell'
      mealCell.innerText = '' // Empty cell for future use
      row.appendChild(mealCell)
  
      // Add click event listener to each cell
      mealCell.addEventListener(
        'click',
        (function (day, mealTime) {
          return function () {
            selectCell(day, mealTime)
          }
        })(days[i], meals[j])
      )
  
      // Store reference to cells for future use
      if (!cells[days[i]]) {
        cells[days[i]] = {}
      }
      cells[days[i]][meals[j]] = mealCell
    }
  
    table.appendChild(row)
  }
  
  let selectedCell = null
  
  function selectCell (day, mealTime) {
    if (selectedCell) {
      selectedCell.classList.remove('selected')
    }
    selectedCell = cells[day][mealTime]
    selectedCell.classList.add('selected')
  }
  
  const shoppingList = {}
  
  function parseFraction (fraction) {
    const parts = fraction.split('/')
    if (parts.length === 2) {
      return parseFloat(parts[0]) / parseFloat(parts[1])
    }
    return parseFloat(fraction)
  }
  
  function parseMeasure (measure) {
    const knownUnits = [
      'g',
      'cloves',
      'sliced',
      'Lbs',
      'grams',
      'whole',
      'tbs',
      'kg',
      'kilograms',
      'lb',
      'pounds',
      'oz',
      'ounces',
      'ml',
      'liters',
      'cups',
      'tbsp',
      'tablespoons',
      'tsp',
      'teaspoons',
      'medium',
      'large',
      'small',
      'Can',
      'strips',
      'tin',
      'bleaves',
      'spinkling',
      'tablespoon minced',
      'juice',
      'fresh sprig',
      'fresh sprig',
      'pound chopped',
      'thick slices',
      'thinly sliced',
      'cup freshly grated',
      'Sprinking'
    ]
    let amount = 0
    let unit = ''
  
    for (var i = 0; i < knownUnits.length; i++) {
      const unitIndex = measure.indexOf(knownUnits[i])
      if (unitIndex !== -1) {
        const amountPart = measure.substring(0, unitIndex).trim()
        unit = knownUnits[i]
        amount = parseFraction(amountPart) || parseFloat(amountPart)
        break
      }
    }
  
    if (!unit) {
      const regex = /^(\d+\s\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)([a-zA-Z\s]+)?$/
      const match = measure.match(regex)
      if (match) {
        if (match[1].includes(' ')) {
          const parts = match[1].split(' ')
          amount = parseFloat(parts[0]) + parseFraction(parts[1])
        } else {
          amount = parseFraction(match[1])
        }
        unit = match[4] ? match[4].trim() : ''
      }
    }
  
    return { amount: amount || 0, unit: unit }
  }
  
  function addMeasures (measure1, measure2) {
    const parsed1 = parseMeasure(measure1)
    const parsed2 = parseMeasure(measure2)
  
    if (parsed1.unit === parsed2.unit) {
      const combinedAmount = parsed1.amount + parsed2.amount
      return `${combinedAmount} ${parsed1.unit}`.trim()
    } else {
      return `${measure1}, ${measure2}`.trim()
    }
  }
  
  function addToTable (mealName, ingredients) {
    if (selectedCell) {
      selectedCell.innerText = mealName
      selectedCell.classList.remove('selected')
      selectedCell = null
  
      for (var i = 0; i < ingredients.length; i++) {
        var item = ingredients[i]
        if (shoppingList[item.ingredient]) {
          shoppingList[item.ingredient].measure = addMeasures(
            shoppingList[item.ingredient].measure,
            item.measure
          )
        } else {
          shoppingList[item.ingredient] = { measure: item.measure }
        }
      }
  
      updateShoppingList()
    } else {
      alert('Please select a cell in the table first.')
    }
  }
  
  function updateShoppingList () {
    const shoppingListDiv = document.getElementById('shopping-list')
    shoppingListDiv.innerHTML = ''
  
    for (var ingredient in shoppingList) {
      if (shoppingList.hasOwnProperty(ingredient)) {
        const listItem = document.createElement('li')
        listItem.innerText = ingredient + ' - ' + shoppingList[ingredient].measure
        shoppingListDiv.appendChild(listItem)
      }
    }
  }
  
  window.onload = function () {
    // Your table and shopping list initialization code here
  }
  