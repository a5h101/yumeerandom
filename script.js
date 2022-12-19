//<===============Inputs========================>
// Esc button can be used to close modal
// Clicking outside modal will close it
//Enter button can be used to search

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const refresh = document.querySelector('#refresh');
const overlay = document.querySelector('.overlay');
let ingredients = '';
let globalData = '';

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);

recipeCloseBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  mealDetailsContent.parentElement.classList.remove('showRecipe');
});

refresh.addEventListener('click', () => {
  location.reload();
});

overlay.addEventListener('click', () => closeModal());

//Close modal on clicking outside modal and pressing esc
function closeModal() {
  overlay.classList.add('hidden');
  mealDetailsContent.parentElement.classList.remove('showRecipe');
}
//to display random meal
function displayRandomMeal() {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(response => response.json())
    .then(data => {
      let html = '';
      if (data.meals) {
        globalData = data.meals;
        html = `<div class="meal-item" id="ourPick" data-id="${data.meals[0].idMeal}">
      <div class="meal-img">
      <img
      src="${data.meals[0].strMealThumb}" alt = "food";
      />
        </div>
        <div class="meal-name">
        <h3>${data.meals[0].strMeal}</h3>
        <a href="#" class="recipe-btn" id="ourButton" onclick="caller(event)">Items Needed</a>
        </div>
        </div>`;
      } else html = 'Sorry, server down';
      document.getElementById('randomDish').innerHTML = html;
      getIngrediends(data.meals);
    });
}

//calls the funcion which makes ingredients list for random
function caller(event) {
  event.preventDefault();
  overlay.classList.remove('hidden');
  mealRecipeModal(globalData, 1);
}
//Makes ingrdient list
function getIngrediends(meal) {
  meal = meal[0];
  ingredients = '';
  for (let i = 9; i <= 28; i++)
    if (Object.values(meal)[i])
      ingredients += `Ingredient ${i - 8} : ${Object.values(meal)[i]} <br>`;
}

//Search results after clicking searchsearch
function getMealList() {
  let searchInputTxt = document.getElementById('search-input').value;
  if (searchInputTxt)
    document.querySelector('#search').classList.remove('hidden');
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInputTxt}`
  )
    .then(response => response.json())
    .then(data => {
      let html = '';
      if (data.meals) {
        data.meals.forEach(meal => {
          html += `
          <div class = "meal-item" data-id = "${meal.idMeal}">
          <div class = "meal-img">
          <img src = "${meal.strMealThumb}" alt = "food">
          </div>
          <div class = "meal-name">
          <h3>${meal.strMeal}</h3>
          <a href = "#" class = "recipe-btn">Items Needed</a>
          </div>
          </div>
          `;
        });
        mealList.classList.remove('notFound');
      } else {
        if (searchInputTxt) {
          html = "Sorry, we didn't find any meal!";
          mealList.classList.add('notFound');
        }
      }
      mealList.innerHTML = html;
    });
}

// get recipe of the meal
function getMealRecipe(event) {
  event.preventDefault();
  if (event.target.classList.contains('recipe-btn')) {
    let mealItem = event.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then(response => response.json())
      .then(data => {
        mealRecipeModal(data.meals, 0);
      });
  }
}

// create a modal
function mealRecipeModal(meal, condition) {
  getIngrediends(meal);
  meal = meal[0];
  let html = `
  <h2 class = "recipe-title">${meal.strMeal}</h2>
  <p class = "recipe-category">${meal.strCategory}</p>
  <div class = "recipe-instruct">
  <h3>${'Ingredients'}</h3>
  <p>${ingredients}</p>
  </div>
  <div class = "recipe-meal-img">
  <img src = "${meal.strMealThumb}" alt = "">
  </div>
  <div class = "recipe-link">
  <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
  </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');
  overlay.classList.remove('hidden');
}
//to Close modal on esc
const esc = document.addEventListener('keyup', event => {
  if (event.key === 'Escape' && !overlay.classList.contains('hidden'))
    closeModal();
});
const enter = document.addEventListener('keyup', event => {
  if (event.key === 'Enter' && document.getElementById('search-input').value) {
    searchBtn.click();
    console.log('enter');
  }
});
//call for Random meal
window.onload = () => displayRandomMeal();
