class RecipeService {

    constructor(){

        this.github=new GithubService();

    }

    async load(profession){

        return await this.github.getJson(

`${CONFIG.PATHS.RECIPES}/${profession}.json`

        );

    }

}