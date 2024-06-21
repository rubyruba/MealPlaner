document.addEventListener('click', function (event) {
  if (event.target && event.target.id === 'add-meal') {
    const mealItem = event.target.closest('li')
    const mealName = mealItem.querySelector('h3').textContent

    let ingredients = []
    for (let i = 1; i <= 20; i++) {
      const measure = mealItem.querySelector(`#measure${i}`)?.textContent
      const ingredient = mealItem.querySelector(`#ingredient${i}`)?.textContent
      if (measure && ingredient) {
        ingredients.push(`${measure} ${ingredient}`)
      }
    }

    console.log('Selected meal:', mealName)
    console.log('Ingredients:', ingredients)

    // Save the mealName and ingredients for the next step. This could be a global variable, local storage, or another method.
    // For example, using localStorage:
    localStorage.setItem(
      'selectedMeal',
      JSON.stringify({ mealName, ingredients })
    )
  }
})
