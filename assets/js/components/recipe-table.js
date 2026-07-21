class RecipeTable {

    constructor(tableId) {

        this.table =
            document.getElementById(tableId);

        this.recipes = [];

    }

    setRecipes(recipes) {

        this.recipes = recipes;

        this.render();

    }

    render() {

        this.table.innerHTML = "";

        if (this.recipes.length === 0) {

            this.table.innerHTML = `

<tr>

<td colspan="6" class="text-center">

Bu meslekte henüz recipe bulunmuyor.

</td>

</tr>

`;

            return;

        }

        this.recipes.forEach((recipe, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `

<td>${recipe.id}</td>

<td>${recipe.name}</td>

<td>${recipe.levelRequired}</td>

<td>${recipe.xpGiven}</td>

<td>${recipe.isIntermediate ? "✔" : "-"}</td>

<td>

<button
class="btn btn-warning btn-sm editRecipe"
data-index="${index}">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-danger btn-sm deleteRecipe"
data-index="${index}">

<i class="bi bi-trash"></i>

</button>

</td>

`;

            this.table.appendChild(row);

        });

    }

}

const recipeTable =
    new RecipeTable("recipeTable");