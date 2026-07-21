// ======================================================
// Rise Craft Admin - editor.js
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
const floatingSaveButton = document.getElementById("floatingSave");
const jsonPreview = document.getElementById("jsonPreview");

// ---------- State ----------
let currentRecipeId = null;
let isDirty = false;

// ---------- Sayfa Yüklenişi ----------
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

// ---------- URL Parametreleri ----------
function getQueryParams() {
    const search = new URLSearchParams(window.location.search);
    return {
        profession: search.get("profession"),
        recipeId: search.get("id")
    };
}

// ---------- Recipe Yükleme ----------
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

// ---------- Form İşlemleri ----------
function fillForm(recipe) {
    recipeIdInput.value = recipe.id || "";
    recipeNameInput.value = recipe.name || "";
    recipeLevelInput.value = recipe.levelRequired || 1;
    recipeXpInput.value = recipe.xpGiven || 0;
    recipeIntermediateInput.checked = !!recipe.isIntermediate;

    materialContainer.innerHTML = "";

    if (recipe.materials) {
        Object.entries(recipe.materials).forEach(([name, amount]) => {
            materialContainer.appendChild(createMaterialRow(name, amount));
        });
    }

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
    materialContainer.appendChild(createMaterialRow());

    updatePreview();
}

// ---------- Material Satırı Oluşturma (Mobil Touch-Target Uyumlu) ----------
function createMaterialRow(name = "", amount = 1) {
    const row = document.createElement("div");
    row.className = "material-row row g-2 mb-2 align-items-center";

    row.innerHTML = `
        <div class="col-7">
            <input
                type="text"
                class="form-control bg-dark text-white border-secondary material-name"
                placeholder="Material Name"
                value="${name}"
                autocapitalize="none">
        </div>
        <div class="col-3">
            <input
                type="number"
                inputmode="numeric"
                min="1"
                class="form-control bg-dark text-white border-secondary material-count"
                value="${amount}">
        </div>
        <div class="col-2 d-grid">
            <button
                type="button"
                class="btn btn-outline-danger removeMaterial touch-btn"
                title="Sil">
                <i class="bi bi-trash fs-6"></i>
            </button>
        </div>
    `;

    return row;
}

// ---------- Material Eventleri ----------
if (addMaterialButton) {
    addMaterialButton.addEventListener("click", () => {
        materialContainer.appendChild(createMaterialRow());
        markDirty();
        updatePreview();
    });
}

document.addEventListener("click", e => {
    const removeButton = e.target.closest(".removeMaterial");
    if (!removeButton) return;

    removeButton.closest(".material-row").remove();
    markDirty();
    updatePreview();
});

// ---------- Form Değişiklik Dinleyicileri ----------
document.addEventListener("input", e => {
    if (
        e.target.classList.contains("material-name") ||
        e.target.classList.contains("material-count") ||
        e.target === recipeIdInput ||
        e.target === recipeNameInput ||
        e.target === recipeLevelInput ||
        e.target === recipeXpInput
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

// ---------- Dirty Durumları ----------
function markDirty() { isDirty = true; }
function clearDirty() { isDirty = false; }

// ---------- JSON Preview Güncelleme ----------
function updatePreview() {
    const tempMaterials = {};

    document.querySelectorAll(".material-row").forEach(row => {
        const nameInput = row.querySelector(".material-name");
        const countInput = row.querySelector(".material-count");

        if (nameInput && countInput) {
            const name = nameInput.value.trim();
            const amount = Number(countInput.value) || 1;

            if (name !== "") {
                tempMaterials[name] = amount;
            }
        }
    });

    const materials = Object.fromEntries(
        Object.entries(tempMaterials).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const recipe = {
        id: recipeIdInput ? recipeIdInput.value.trim() : "",
        name: recipeNameInput ? recipeNameInput.value.trim() : "",
        levelRequired: recipeLevelInput ? Number(recipeLevelInput.value) : 1,
        xpGiven: recipeXpInput ? Number(recipeXpInput.value) : 0,
        isIntermediate: recipeIntermediateInput ? recipeIntermediateInput.checked : false,
        materials
    };

    if (jsonPreview) {
        jsonPreview.textContent = JSON.stringify(recipe, null, 2);
    }
}

// ---------- Doğrulama (Validation) ----------
function validateRecipe(recipe) {
    if (!recipe.id) return "Recipe ID boş olamaz.";
    if (!recipe.name) return "Recipe adı boş olamaz.";
    if (recipe.levelRequired < 1) return "Level en az 1 olmalıdır.";
    if (recipe.xpGiven < 0) return "XP 0'dan küçük olamaz.";
    if (Object.keys(recipe.materials).length === 0) return "En az bir geçerli material eklemelisiniz.";
    return null;
}

// ---------- Taslak Kaydetme (Save Draft) ----------
function saveDraft() {
    updatePreview();
    
    let recipe;
    try {
        recipe = JSON.parse(jsonPreview.textContent);
    } catch(e) {
        alert("JSON formatı geçersiz.");
        return;
    }

    const error = validateRecipe(recipe);
    if (error) {
        alert(error);
        return;
    }

    const recipes = [...state.recipes];

    // Mükerrer ID kontrolü
    const duplicate = recipes.find(r => r.id === recipe.id && r.id !== currentRecipeId);
    if (duplicate) {
        alert("Bu Recipe ID zaten başka bir reçetede kullanılıyor.");
        return;
    }

    // Güncelleme veya Ekleme
    if (currentRecipeId) {
        const index = recipes.findIndex(r => r.id === currentRecipeId);
        if (index >= 0) {
            recipes[index] = recipe;
        }
    } else {
        recipes.push(recipe);
    }

    // Level ve isme göre sırala
    recipes.sort((a, b) => {
        if (a.levelRequired !== b.levelRequired) return a.levelRequired - b.levelRequired;
        return a.name.localeCompare(b.name);
    });

    state.setRecipes(recipes);
    state.saveDraft(state.currentProfession, recipes);

    currentRecipeId = recipe.id;
    clearDirty();

    if (typeof navbar !== "undefined" && navbar.update) {
        navbar.update();
    }

    alert("Taslak başarıyla yerel hafızaya kaydedildi! 🎉");
}

if (saveDraftButton) {
    saveDraftButton.addEventListener("click", saveDraft);
}

if (floatingSaveButton) {
    floatingSaveButton.addEventListener("click", saveDraft);
}

// ---------- Geri Butonu ----------
function handleBackNavigation() {
    if (isDirty) {
        if (!confirm("Kaydedilmemiş değişiklikler var. Çıkmak istiyor musunuz?")) {
            return;
        }
    }
    location.href = "recipes.html";
}

const backButton = document.getElementById("backButton");
const backButtonMobile = document.getElementById("backButtonMobile");

if (backButton) backButton.addEventListener("click", handleBackNavigation);
if (backButtonMobile) backButtonMobile.addEventListener("click", handleBackNavigation);

// Kısayollar ve Sayfa Çıkış Kontrolü
document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
    }
    if (e.key === "Escape") {
        handleBackNavigation();
    }
});

window.addEventListener("beforeunload", e => {
    if (!isDirty) return;
    e.preventDefault();
    e.returnValue = "";
});
