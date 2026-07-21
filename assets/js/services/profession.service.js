class ProfessionService {

    constructor() {
        this.path = "modules/professions.json";
    }

    async load(forceRefresh = false) {

        return await githubService.downloadJson(
            this.path,
            forceRefresh
        );

    }

}

const professionService = new ProfessionService();