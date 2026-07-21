const materialContainer = document.getElementById("materialContainer");

const recipeIdInput = document.getElementById("recipeId");
const recipeNameInput = document.getElementById("recipeName");
const recipeLevelInput = document.getElementById("recipeLevel");
const recipeXpInput = document.getElementById("recipeXp");
const recipeIntermediateInput = document.getElementById("recipeIntermediate");

const jsonPreview = document.getElementById("jsonPreview");

const addMaterialButton = document.getElementById("addMaterial");
const saveDraftButton = document.getElementById("saveDraft");

addMaterialButton.addEventListener("click", () => {

    materialContainer.appendChild(createMaterialRow());

    updatePreview();

});

document.addEventListener("click", e => {

    const removeButton = e.target.closest(".removeMaterial");

    if (!removeButton) return;

    removeButton.closest(".material-row").remove();

    updatePreview();

});

document.addEventListener("input", updatePreview);

function updatePreview() {

    const materials = {};

    document.querySelectorAll(".material-row").forEach(row => {

        const materialName = row
            .querySelector(".material-name")
            .value
            .trim();

        const materialCount = Number(
            row.querySelector(".material-count").value
        ) || 1;

        if (materialName !== "") {

            materials[materialName] = materialCount;

        }

    });

    const recipe = {

        id: recipeIdInput.value.trim(),

        name: recipeNameInput.value.trim(),

        levelRequired: Number(recipeLevelInput.value),

        xpGiven: Number(recipeXpInput.value),

        isIntermediate: recipeIntermediateInput.checked,

        materials

    };

    jsonPreview.textContent = JSON.stringify(recipe, null, 2);

}

saveDraftButton.addEventListener("click", () => {

    const recipe = JSON.parse(jsonPreview.textContent);

    const error = validateRecipe(recipe);

    if (error) {

        alert(error);

        return;

    }

    const recipes = [...state.recipes];

    const index = recipes.findIndex(r => r.id === recipe.id);

    if (index >= 0) {

        recipes[index] = recipe;

    } else {

        recipes.push(recipe);

    }

    state.setRecipes(recipes);

    state.saveDraft(state.currentProfession, recipes);

    publishService.addRecipeFile(state.currentProfession, recipes);

    navbar.update();

    alert("Taslak kaydedildi.");

});