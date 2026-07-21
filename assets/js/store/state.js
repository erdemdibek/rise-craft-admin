class AppState {

    constructor() {

        this.manifest = null;

        this.professions = {};

        this.currentProfession = null;

        this.recipes = [];

        this.drafts = {};

    }

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


    saveDraft(profession, recipes) {

        this.drafts[profession] = structuredClone(recipes);

    }

    getDraft(profession) {

        return this.drafts[profession] ?? null;

    }

    hasDraft(profession) {

        return profession in this.drafts;

    }

    clearDraft(profession) {

        delete this.drafts[profession];

    }

}

const state = new AppState();