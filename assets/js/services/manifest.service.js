class ManifestService {

    constructor(){

        this.github=new GithubService();

    }

    async load(){

        return await this.github.getJson(

            CONFIG.PATHS.MANIFEST

        );

    }

}