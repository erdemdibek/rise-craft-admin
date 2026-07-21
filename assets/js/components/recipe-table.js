class RecipeTable {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.recipes = [];
    }

    setRecipes(recipes) {
        this.recipes = recipes ?? [];
        this.render();
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = "";

        if (this.recipes.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-secondary">
                        Henüz bu mesleğe ait recipe bulunmuyor.
                    </td>
                </tr>
            `;
            return;
        }

        this.recipes.forEach((recipe, index) => {
            this.container.appendChild(this.createRow(recipe, index));
        });
    }

    createRow(recipe, index) {
        const tr = document.createElement("tr");
        tr.dataset.index = index;

        tr.innerHTML = `
            <td><code>${recipe.id}</code></td>
            <td class="fw-medium">${recipe.name || '-'}</td>
            <td><span class="badge bg-secondary">${recipe.profession || '-'}</span></td>
            <td><span class="badge bg-dark border border-secondary">${recipe.levelRequired ?? recipe.level ?? 1}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-warning editRecipe" data-index="${index}" title="Düzenle">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger deleteRecipe" data-index="${index}" title="Sil">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    refresh() { this.render(); }
    add(recipe) { this.recipes.push(recipe); this.render(); }
    update(index, recipe) { this.recipes[index] = recipe; this.render(); }
    remove(index) { this.recipes.splice(index, 1); this.render(); }
    clear() { this.recipes = []; this.render(); }
}

// HTML'deki tbody ID'si ile eşleştirildi
const recipeTable = new RecipeTable("recipeTableBody");
