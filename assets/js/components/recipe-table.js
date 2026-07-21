class RecipeTable {

    constructor(tableId) {

        this.table = document.getElementById(tableId);

        this.recipes = [];

    }

    setRecipes(recipes) {

        this.recipes = recipes ?? [];

        this.render();

    }

    render() {

        this.table.innerHTML = "";

        if (this.recipes.length === 0) {

            this.table.innerHTML = `

<tr>

<td colspan="6" class="text-center py-4">

Henüz recipe bulunmuyor.

</td>

</tr>

`;

            return;

        }

        this.recipes.forEach((recipe, index) => {

            this.table.appendChild(

                this.createRow(recipe, index)

            );

        });

    }

    createRow(recipe, index) {

        const tr = document.createElement("tr");

        tr.dataset.index = index;

        tr.innerHTML = `

<td>

<code>${recipe.id}</code>

</td>

<td>

${recipe.name}

</td>

<td>

${recipe.levelRequired}

</td>

<td>

${recipe.xpGiven}

</td>

<td class="text-center">

${recipe.isIntermediate
? '<span class="badge bg-success">YES</span>'
: '<span class="badge bg-secondary">NO</span>'}

</td>

<td>

<div class="btn-group btn-group-sm">

<button
class="btn btn-warning editRecipe"
data-index="${index}"
title="Düzenle">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-danger deleteRecipe"
data-index="${index}"
title="Sil">

<i class="bi bi-trash"></i>

</button>

</div>

</td>

`;

        return tr;

    }

    refresh() {

        this.render();

    }

    add(recipe) {

        this.recipes.push(recipe);

        this.render();

    }

    update(index, recipe) {

        this.recipes[index] = recipe;

        this.render();

    }

    remove(index) {

        this.recipes.splice(index, 1);

        this.render();

    }

    clear() {

        this.recipes = [];

        this.render();

    }

}

const recipeTable = new RecipeTable("recipeTable");