// ======================================================
// Rise Craft Admin
// editor.js
// Part 1 / 3
// ======================================================

// ---------- DOM ----------

const recipeIdInput = document.getElementById("recipeId");
const recipeNameInput = document.getElementById("recipeName");
const recipeLevelInput = document.getElementById("recipeLevel");
const recipeXpInput = document.getElementById("recipeXp");
const recipeIntermediateInput = document.getElementById("recipeIntermediate");

const materialContainer = document.getElementById("materialContainer");

const addMaterialButton = document.getElementById("addMaterial");
const saveDraftButton = document.getElementById("saveDraft");

const jsonPreview = document.getElementById("jsonPreview");

// ---------- State ----------

let currentRecipeId = null;

let isDirty = false;

// ---------- Sayfa ----------

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const params = getQueryParams();

        if (!params.profession) {

            alert("Meslek bilgisi bulunamadı.");

            location.href = "recipes.html";

            return;

        }

        state.setCurrentProfession(params.profession);

        await loadRecipe(params.profession, params.recipeId);

    } catch (err) {

        console.error(err);

        alert("Editor başlatılamadı.");

    }

});

// ---------- URL ----------

function getQueryParams() {

    const search = new URLSearchParams(window.location.search);

    return {

        profession: search.get("profession"),

        recipeId: search.get("id")

    };

}

// ---------- Recipe ----------

async function loadRecipe(profession, recipeId) {

    let recipes;

    if (state.hasDraft(profession)) {

        recipes = state.getDraft(profession);

    } else {

        recipes = await recipeService.load(profession);

    }

    state.setRecipes(recipes);

    if (!recipeId) {

        createEmptyRecipe();

        return;

    }

    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) {

        alert("Recipe bulunamadı.");

        location.href = "recipes.html";

        return;

    }

    currentRecipeId = recipe.id;

    fillForm(recipe);

}

// ---------- Form ----------

function fillForm(recipe) {

    recipeIdInput.value = recipe.id;

    recipeNameInput.value = recipe.name;

    recipeLevelInput.value = recipe.levelRequired;

    recipeXpInput.value = recipe.xpGiven;

    recipeIntermediateInput.checked = recipe.isIntermediate;

    materialContainer.innerHTML = "";

    Object.entries(recipe.materials).forEach(([name, amount]) => {

        materialContainer.appendChild(

            createMaterialRow(name, amount)

        );

    });

    updatePreview();

}

function createEmptyRecipe() {

    currentRecipeId = null;

    recipeIdInput.value = "";

    recipeNameInput.value = "";

    recipeLevelInput.value = 1;

    recipeXpInput.value = 0;

    recipeIntermediateInput.checked = false;

    materialContainer.innerHTML = "";

    materialContainer.appendChild(

        createMaterialRow()

    );

    updatePreview();

}

// ---------- Material ----------

function createMaterialRow(name = "", amount = 1) {

    const row = document.createElement("div");

    row.className = "material-row row g-2 mb-2";

    row.innerHTML = `

        <div class="col-7">

            <input
                type="text"
                class="form-control material-name"
                placeholder="Material Name"
                value="${name}">

        </div>

        <div class="col-3">

            <input
                type="number"
                min="1"
                class="form-control material-count"
                value="${amount}">

        </div>

        <div class="col-2 d-grid">

            <button
                type="button"
                class="btn btn-danger removeMaterial">

                <i class="bi bi-trash"></i>

            </button>

        </div>

    `;

    return row;

}

// ======================================================
// editor.js
// Part 2 / 3
// ======================================================

// ---------- Material Events ----------

addMaterialButton.addEventListener("click", () => {

    materialContainer.appendChild(createMaterialRow());

    markDirty();

    updatePreview();

});

document.addEventListener("click", e => {

    const removeButton = e.target.closest(".removeMaterial");

    if (!removeButton) return;

    removeButton.closest(".material-row").remove();

    markDirty();

    updatePreview();

});

// ---------- Form Events ----------

document.addEventListener("input", e => {

    if (

        e.target.classList.contains("material-name") ||

        e.target.classList.contains("material-count") ||

        e.target === recipeIdInput ||

        e.target === recipeNameInput ||

        e.target === recipeLevelInput ||

        e.target === recipeXpInput ||

        e.target === recipeIntermediateInput

    ) {

        markDirty();

        updatePreview();

    }

});

document.addEventListener("change", e => {

    if (e.target === recipeIntermediateInput) {

        markDirty();

        updatePreview();

    }

});

// ---------- Dirty ----------

function markDirty() {

    isDirty = true;

}

function clearDirty() {

    isDirty = false;

}

// ---------- JSON Preview ----------

function updatePreview() {

    const tempMaterials = {};

    document.querySelectorAll(".material-row").forEach(row => {

        const name = row
            .querySelector(".material-name")
            .value
            .trim();

        const amount = Number(

            row.querySelector(".material-count").value

        ) || 1;

        if (name !== "") {

            tempMaterials[name] = amount;

        }

    });

    const materials = Object.fromEntries(

        Object.entries(tempMaterials)

            .sort((a, b) =>

                a[0].localeCompare(b[0])

            )

    );

    const recipe = {

        id: recipeIdInput.value.trim(),

        name: recipeNameInput.value.trim(),

        levelRequired: Number(recipeLevelInput.value),

        xpGiven: Number(recipeXpInput.value),

        isIntermediate: recipeIntermediateInput.checked,

        materials

    };

    jsonPreview.textContent = JSON.stringify(

        recipe,

        null,

        2

    );

}

// ---------- Ctrl + S ----------

document.addEventListener("keydown", e => {

    if (

        (e.ctrlKey || e.metaKey) &&

        e.key.toLowerCase() === "s"

    ) {

        e.preventDefault();

        saveDraft();

    }

});

// ---------- Sayfadan Ayrılma ----------

window.addEventListener("beforeunload", e => {

    if (!isDirty) return;

    e.preventDefault();

    e.returnValue = "";

});

// ======================================================
// editor.js
// Part 3 / 3
// ======================================================

// ---------- Validation ----------

function validateRecipe(recipe) {

    if (!recipe.id)
        return "Recipe ID boş olamaz.";

    if (!recipe.name)
        return "Recipe adı boş olamaz.";

    if (recipe.levelRequired < 1)
        return "Level en az 1 olmalıdır.";

    if (recipe.xpGiven < 0)
        return "XP 0'dan küçük olamaz.";

    if (Object.keys(recipe.materials).length === 0)
        return "En az bir material eklemelisiniz.";

    return null;

}

// ---------- Save ----------

function saveDraft() {

    updatePreview();

    const recipe = JSON.parse(jsonPreview.textContent);

    const error = validateRecipe(recipe);

    if (error) {

        alert(error);

        return;

    }

    const recipes = [...state.recipes];

    // Yeni ID oluşturulurken aynı ID var mı?

    const duplicate = recipes.find(r =>
        r.id === recipe.id &&
        r.id !== currentRecipeId
    );

    if (duplicate) {

        alert("Bu Recipe ID zaten kullanılıyor.");

        return;

    }

    // Düzenleme

    if (currentRecipeId) {

        const index = recipes.findIndex(
            r => r.id === currentRecipeId
        );

        if (index >= 0) {

            recipes[index] = recipe;

        }

    }

    // Yeni kayıt

    else {

        recipes.push(recipe);

    }

    // Level sıralaması

    recipes.sort((a, b) => {

        if (a.levelRequired !== b.levelRequired)

            return a.levelRequired - b.levelRequired;

        return a.name.localeCompare(b.name);

    });

    state.setRecipes(recipes);

    state.saveDraft(

        state.currentProfession,

        recipes

    );

    publishService.addRecipeFile(

        state.currentProfession,

        recipes

    );

    currentRecipeId = recipe.id;

    clearDirty();

    if (typeof navbar !== "undefined") {

        navbar.update();

    }

    alert("Taslak başarıyla kaydedildi.");

}

// ---------- Button ----------

saveDraftButton.addEventListener(

    "click",

    saveDraft

);

// ---------- ESC ----------

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        if (!isDirty) {

            location.href = "recipes.html";

            return;

        }

        if (confirm("Kaydedilmemiş değişiklikler var. Çıkılsın mı?")) {

            location.href = "recipes.html";

        }

    }

});

// ---------- Back Button ----------

const backButton = document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener("click", () => {

        if (isDirty) {

            if (!confirm("Kaydedilmemiş değişiklikler var. Çıkmak istiyor musunuz?")) {

                return;

            }

        }

        location.href = "recipes.html";

    });

}

// ---------- İlk Preview ----------

updatePreview();