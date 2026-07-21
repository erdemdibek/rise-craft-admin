class ProfessionService {

    constructor() {
        this.path = "modules/recipes.json";
    }

    async load(forceRefresh = false) {

        return await githubService.downloadJson(
            this.path,
            forceRefresh
        );

    }

}

const professionService = new ProfessionService();
