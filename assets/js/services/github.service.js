export default class GithubService {

    constructor() {

        this.baseUrl =
            "https://raw.githubusercontent.com/erdemdibek/rise-craft-companion-data/main";

    }

    async getManifest() {

        const response =
            await fetch(
                `${this.baseUrl}/manifest.json`
            );

        return await response.json();

    }

}