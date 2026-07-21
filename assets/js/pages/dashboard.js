document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. Manifest Yükleme ve Versiyon Güncellemeleri
        const manifest = await manifestService.load();
        if (manifest) {
            state.setManifest(manifest);
            
            const contentVerEl = document.getElementById("contentVersion");
            if (contentVerEl) contentVerEl.innerText = manifest.contentVersion || "0";

            const recipeVerEl = document.getElementById("recipeVersion");
            if (recipeVerEl) recipeVerEl.innerText = manifest.modules?.recipes?.version || "0";

            const materialVerEl = document.getElementById("materialVersion");
            if (materialVerEl) materialVerEl.innerText = manifest.modules?.materials?.version || "0";
        }

        // 2. Meslekleri Yükleme
        const professions = await professionService.load();
        state.setProfessions(professions);

        if (typeof sidebar !== "undefined" && sidebar.render) {
            sidebar.render(professions);
        }

        // 3. Meslek ve Toplam Recipe Hesabı (Array / Object Esnekliği)
        let totalRecipes = 0;
        const professionList = Array.isArray(professions) 
            ? professions 
            : Object.keys(professions);

        for (const profession of professionList) {
            const profKey = typeof profession === "object" ? profession.id : profession;
            try {
                const recipes = await recipeService.load(profKey);
                if (Array.isArray(recipes)) {
                    totalRecipes += recipes.length;
                }
            } catch (err) {
                console.warn(`${profKey} recipes yüklenemedi:`, err);
            }
        }

        // Stat Kartlarını Güncelle
        const recipeCountEl = document.getElementById("recipeCount");
        if (recipeCountEl) recipeCountEl.innerText = totalRecipes;

        const profCountEl = document.getElementById("professionCount");
        if (profCountEl) profCountEl.innerText = professionList.length;

        // 4. Taslak ve Publish Queue Durumunu Güncelle
        updatePublishQueueUI();

        // Navbar/Header durumunu güncelle (Varsa)
        if (typeof navbar !== "undefined" && navbar.update) {
            navbar.update();
        }

    } catch (e) {
        console.error("Dashboard yüklenme hatası:", e);
        alert("Veriler okunamadı.");
    }
});

// Taslak ve Publish Queue Alanlarını Dolduran Yardımcı Fonksiyon
function updatePublishQueueUI() {
    const drafts = state.drafts || {};
    const draftKeys = Object.keys(drafts);
    const draftCount = draftKeys.length;

    // Publish Count Sayacı
    const publishCountEl = document.getElementById("publishCount");
    if (publishCountEl) {
        publishCountEl.innerText = draftCount;
    }

    // Publish Queue Liste Kutusu
    const publishQueueEl = document.getElementById("publishQueue");
    if (publishQueueEl) {
        if (draftCount === 0) {
            publishQueueEl.innerHTML = `
                <div class="list-group-item bg-transparent text-secondary border-0 ps-0">
                    Publish bekleyen dosya yok.
                </div>`;
        } else {
            publishQueueEl.innerHTML = draftKeys.map(key => `
                <div class="list-group-item bg-transparent text-white border-secondary d-flex justify-content-between align-items-center px-0">
                    <span><i class="bi bi-file-earmark-code text-warning me-2"></i>${key}.json</span>
                    <span class="badge bg-warning text-dark">Taslak</span>
                </div>
            `).join("");
        }
    }
}
