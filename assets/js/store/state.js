class AppState {
    constructor() {
        this.manifest = null;
        this.professions = {};
        this.currentProfession = null;
        this.recipes = [];
        // Uygulama açıldığında kayıtlı taslakları hafızadan yükle
        this.drafts = this.loadDraftsFromStorage();
    }

    // --- MANIFEST & PROFESSIONS ---
    setManifest(manifest) {
        this.manifest = manifest;
    }

    setProfessions(professions) {
        this.professions = professions;
    }

    setCurrentProfession(profession) {
        this.currentProfession = profession;
    }

    setRecipes(recipes) {
        this.recipes = recipes;
    }

    // --- DRAFT MANAGEMENT (LOCAL STORAGE SUPPORT) ---
    saveDraft(profession, recipes) {
        if (!profession) return;

        // Mobil cihaz uyumluluğu için güvenli kopyalama
        const copy = typeof structuredClone === "function" 
            ? structuredClone(recipes) 
            : JSON.parse(JSON.stringify(recipes));

        this.drafts[profession] = copy;
        this.persistDrafts();
    }

    getDraft(profession) {
        return this.drafts[profession] ?? null;
    }

    hasDraft(profession) {
        return profession in this.drafts && Array.isArray(this.drafts[profession]);
    }

    clearDraft(profession) {
        delete this.drafts[profession];
        this.persistDrafts();
    }

    clearAllDrafts() {
        this.drafts = {};
        localStorage.removeItem("rise_craft_drafts");
    }

    // Toplam taslak sayısını verir (Navbar/Badge için)
    getTotalDraftCount() {
        return Object.keys(this.drafts).length;
    }

    // --- PERSISTENCE HELPERS ---
    persistDrafts() {
        try {
            localStorage.setItem("rise_craft_drafts", JSON.stringify(this.drafts));
        } catch (e) {
            console.error("Taslaklar localStorage'a kaydedilemedi:", e);
        }
    }

    loadDraftsFromStorage() {
        try {
            const saved = localStorage.getItem("rise_craft_drafts");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Taslaklar okunamadı:", e);
            return {};
        }
    }
}

const state = new AppState();
