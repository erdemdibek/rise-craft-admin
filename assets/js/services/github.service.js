class GithubService {

    async getJson(path) {

        const url =
            `${CONFIG.GITHUB.RAW_BASE}/${path}`;

        const response = await fetch(url);

        if (!response.ok)
            throw new Error(`Dosya okunamadı : ${path}`);

        return await response.json();

    }

}