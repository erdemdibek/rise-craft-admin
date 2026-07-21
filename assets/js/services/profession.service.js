class ProfessionService {

    constructor(){

        this.github=new GithubService();

    }

    async load(){

        return await this.github.getJson(

            CONFIG.PATHS.PROFESSIONS

        );

    }

    getList(json){

        return Object.keys(json);

    }

}