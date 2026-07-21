document.addEventListener("DOMContentLoaded", async () => {

    try {

        const professions = await professionService.load();

        state.setProfessions(professions);

        sidebar.render(professions);

        bindSearch();
        bindNewRecipe();

    } catch (e) {

        console.error(e);

        alert("Meslekler yüklenemedi.");

    }

});

async function loadProfession(profession) {

    try {

        sidebar.setActive(profession);

        state.setCurrentProfession(profession);

        document.getElementById("selectedProfession").textContent =
            formatProfession(profession);

        let recipes;

        if (state.hasDraft(profession)) {

            recipes = state.getDraft(profession);

        } else {

            recipes = await recipeService.load(profession);

        }

        state.setRecipes(recipes);

        recipeTable.setRecipes(recipes);

        navbar.update();

    } catch (e) {

        console.error(e);

        alert("Recipe yüklenemedi.");

    }

}

function bindSearch() {

    const input = document.getElementById("searchInput");

    input.addEventListener("input", () => {

        const keyword = input.value.trim().toLowerCase();

        if (keyword === "") {

            recipeTable.setRecipes(state.recipes);

            return;

        }

        const filtered = state.recipes.filter(recipe =>

            recipe.id.toLowerCase().includes(keyword) ||

            recipe.name.toLowerCase().includes(keyword)

        );

        recipeTable.setRecipes(filtered);

    });

}

function bindNewRecipe() {

    document
        .getElementById("newRecipeButton")
        .addEventListener("click", () => {

            if (!state.currentProfession) {

                alert("Önce bir meslek seçiniz.");

                return;

            }

            location.href =
                `editor.html?profession=${state.currentProfession}`;

        });

}

document.addEventListener("click", e => {

    const editButton = e.target.closest(".editRecipe");

    if (editButton) {

        openEditor(Number(editButton.dataset.index));

        return;

    }

    const deleteButton = e.target.closest(".deleteRecipe");

    if (deleteButton) {

        deleteRecipe(Number(deleteButton.dataset.index));

    }

});

function openEditor(index) {

    state.setSelectedRecipe(state.recipes[index]);

    location.href =
        `editor.html?profession=${state.currentProfession}&index=${index}`;

}

function deleteRecipe(index) {

    if (!confirm("Recipe silinsin mi?")) {

        return;

    }

    state.recipes.splice(index, 1);

    recipeTable.remove(index);

    state.saveDraft(

        state.currentProfession,

        state.recipes

    );

    publishService.addRecipeFile(

        state.currentProfession,

        state.recipes

    );

    navbar.update();

}

function formatProfession(name) {

    return name
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

}