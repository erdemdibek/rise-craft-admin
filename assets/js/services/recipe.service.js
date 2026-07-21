class RecipeService {

    async load(profession, forceRefresh = false) {

        if (!profession) {
            throw new Error("Meslek belirtilmedi.");
        }

        return await githubService.downloadJson(
            `modules/recipes/${profession}.json`,
            forceRefresh
        );

    }

}

const recipeService = new RecipeService();