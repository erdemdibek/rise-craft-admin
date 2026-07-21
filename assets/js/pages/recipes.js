document.addEventListener("click", async (e) => {

    const btn = e.target.closest("[data-profession]");

    if (!btn) return;

    const profession = btn.dataset.profession;

    const recipes = await recipeService.load(profession);

    renderRecipes(recipes);

});

function renderRecipes(recipes){

    const tbody=document.getElementById("recipeTable");

    tbody.innerHTML="";

    recipes.forEach(recipe=>{

        tbody.innerHTML+=`

<tr>

<td>${recipe.id}</td>

<td>${recipe.name}</td>

<td>${recipe.levelRequired}</td>

<td>${recipe.xpGiven}</td>

<td>

<button
class="btn btn-sm btn-warning"

data-edit="${recipe.id}">

Edit

</button>

</td>

</tr>

`;

    });

}