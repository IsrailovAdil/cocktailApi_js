const cocktailsUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
const ingredientsUrl='www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
let allCocktails = [];
let allIngredients=[];

fetch(cocktailsUrl)
    .then(res => res.json())
    .then(data => {
        allCocktails = data.drinks;
        displayCocktail(allCocktails.slice(0,12));
        fetchIngredients(allCocktails.slice(0,8));
    });

const displayCocktail = (cocktails) => {
    const row = document.querySelector('#cocktail-row');
    row.innerHTML = cocktails.map(cocktail => {
        return `
                    <div class="col-3 card-container">
                        <div class="card" data-id="${cocktail.idDrink}" data-drink="${cocktail.strDrink}" data-image="${cocktail.strDrinkThumb}">
                            <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
                            <div class="card-body">
                                <h3 class="card-title">${cocktail.strDrink}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('');

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            const drinkId = e.currentTarget.dataset.id;
            showModal(drinkId);
        });
    });
}

const searchField = document.getElementById('searchField');
const submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    const searchValue = searchField.value.toLowerCase();
    const filteredCocktails = allCocktails.filter(cocktail =>
        cocktail.strDrink.toLowerCase().includes(searchValue)
    );
    displayCocktail(filteredCocktails);
});

const showModal = (drinkId) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
        .then(res => res.json())
        .then(data => {
            const drink = data.drinks[0];
            document.getElementById('modalTitle').innerText = drink.strDrink;
            document.getElementById('modalImage').src = drink.strDrinkThumb;

            const ingredientsList = document.getElementById('modalIngredients');
            ingredientsList.innerHTML = '';

            for (let i = 1; i <= 15; i++) {
                const ingredient = drink[`strIngredient${i}`];
                const measure = drink[`strMeasure${i}`];

                if (ingredient) {
                    const ingredientItem = document.createElement('div');
                    ingredientItem.className = 'ingredient-item';
                    const imgSrc = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`;
                    ingredientItem.innerHTML = `<img src="${imgSrc}" alt="${ingredient}"> ${measure ? measure : ''} ${ingredient}`;
                    ingredientsList.appendChild(ingredientItem);
                }
            }

            document.getElementById('cocktailModal').classList.add('show');
        });
}

const closeModal = () => {
    document.getElementById('cocktailModal').classList.remove('show');
}



const fetchIngredients = (cocktails) => {
    cocktails.forEach(cocktail => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`)
            .then(res => res.json())
            .then(data => {
                const drink = data.drinks[0];
                for (let i = 1; i <= 15; i++) {
                    const ingredient = drink[`strIngredient${i}`];
                    if (ingredient) {
                        allIngredients[ingredient] = (allIngredients[ingredient] || 0) + 1;
                    }
                }
                displayIngredients();
            });
    });
}

const displayIngredients = () => {
    const sortedIngredients = Object.entries(allIngredients).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const row = document.getElementById('ingredient-row');
    row.innerHTML = sortedIngredients.map(([ingredient, count]) => {
        const imgSrc = `https://www.thecocktaildb.com/images/ingredients/${ingredient}.png`;
        return `
                    <div class="col-3 card-container">
                        <div class="card">
                            <img src="${imgSrc}" class="card-img-top p-3" alt="${ingredient}">
                            <div class="card-body">
                                <h3 class="card-title">${ingredient}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('');
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const letterButtons = document.getElementById('letter-buttons');

alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter.toUpperCase();

    button.addEventListener('click', () => {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(res => res.json())
            .then(data => {
                allCocktails = data.drinks ? data.drinks : [];
                displayCocktailLetter(allCocktails);

            });
    });
    letterButtons.appendChild(button);
});

const displayCocktailLetter = (cocktails) => {
    const row = document.querySelector('#cocktail-sort-row');
    row.innerHTML = cocktails.map(cocktail => {
        return `
                    <div class="col-3 card-container">
                        <div class="card" data-id="${cocktail.idDrink}" data-drink="${cocktail.strDrink}" data-image="${cocktail.strDrinkThumb}">
                            <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
                            <div class="card-body">
                                <h3 class="card-title">${cocktail.strDrink}</h3>
                            </div>
                        </div>
                    </div>`;
    }).join('')};