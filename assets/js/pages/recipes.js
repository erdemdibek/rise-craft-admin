document.addEventListener("DOMContentLoaded", async () => {

    try {

        const professions = await professionService.load();

        state.setProfessions(professions);

        sidebar.render(professions);

        bindSidebarEvents();

        bindSearch();

    } catch (e) {

        console.error(e);

        alert("Meslekler yüklenemedi.");

    }

});

async function loadProfession(profession) {

    try {

        state.setCurrentProfession(profession);

        document.getElementById("selectedProfession").innerText =
            profession
                .replaceAll("_", " ")
                .replace(/\b\w/g, l => l.toUpperCase());

        let recipes;

        if (state.hasDraft(profession)) {

            recipes = state.getDraft(profession);

        } else {

            recipes = await recipeService.load(profession);

        }

        state.setRecipes(recipes);

        recipeTable.setRecipes(recipes);

    } catch (e) {

        console.error(e);

        alert("Recipe yüklenemedi.");

    }

}

function bindSidebarEvents() {

    document.querySelectorAll("[data-profession]").forEach(button => {

        button.addEventListener("click", () => {

            loadProfession(button.dataset.profession);

        });

    });

}

function bindSearch() {

    const input = document.getElementById("searchInput");

    input.addEventListener("input", () => {

        const text = input.value.toLowerCase();

        const filtered = state.recipes.filter(recipe =>

            recipe.name.toLowerCase().includes(text) ||

            recipe.id.toLowerCase().includes(text)

        );

        recipeTable.setRecipes(filtered);

    });

}

document.addEventListener("click", e => {

    if (e.target.closest(".editRecipe")) {

        const index =
            e.target.closest(".editRecipe").dataset.index;

        openEditor(index);

    }

    if (e.target.closest(".deleteRecipe")) {

        const index =
            e.target.closest(".deleteRecipe").dataset.index;

        deleteRecipe(index);

    }

});

function openEditor(index) {

    state.setSelectedRecipe(state.recipes[index]);

    location.href =
        `editor.html?profession=${state.currentProfession}&index=${index}`;

}

function deleteRecipe(index) {

    if (!confirm("Recipe silinsin mi?"))
        return;

    state.recipes.splice(index, 1);

    state.saveDraft(

        state.currentProfession,

        state.recipes

    );

    publishService.addRecipeFile(

        state.currentProfession,

        state.recipes

    );

    recipeTable.setRecipes(state.recipes);

    navbar.update();

}