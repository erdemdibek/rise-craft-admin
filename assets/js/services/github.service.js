class GithubService {

    constructor() {

        this.api = "https://api.github.com";

        this.shaCache = {};

        this.fileCache = {};

    }

    headers() {

        return {

            Authorization: `Bearer ${CONFIG.TOKEN}`,

            Accept: "application/vnd.github+json",

            "Content-Type": "application/json"

        };

    }

    clearCache() {

        this.shaCache = {};

        this.fileCache = {};

    }

    async getFile(path, forceRefresh = false) {

        if (!forceRefresh && this.fileCache[path]) {

            return this.fileCache[path];

        }

        const response = await fetch(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}?ref=${CONFIG.BRANCH}`,

            {

                headers: this.headers()

            }

        );

        if (!response.ok) {

            throw new Error(`Dosya okunamadı: ${path}`);

        }

        const file = await response.json();

        this.shaCache[path] = file.sha;

        this.fileCache[path] = file;

        return file;

    }

    async downloadJson(path, forceRefresh = false) {

        const file = await this.getFile(path, forceRefresh);

        return JSON.parse(

            atob(file.content)

        );

    }

    async uploadJson(path, json, message) {

        if (!this.shaCache[path]) {

            await this.getFile(path);

        }

        const body = {

            message,

            branch: CONFIG.BRANCH,

            sha: this.shaCache[path],

            content: btoa(

                JSON.stringify(

                    json,

                    null,

                    2

                )

            )

        };

        const response = await fetch(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,

            {

                method: "PUT",

                headers: this.headers(),

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error(

                await response.text()

            );

        }

        const result = await response.json();

        this.shaCache[path] = result.content.sha;

        delete this.fileCache[path];

        return result;

    }

    async uploadText(path, text, message) {

        if (!this.shaCache[path]) {

            await this.getFile(path);

        }

        const body = {

            message,

            branch: CONFIG.BRANCH,

            sha: this.shaCache[path],

            content: btoa(text)

        };

        const response = await fetch(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,

            {

                method: "PUT",

                headers: this.headers(),

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error(

                await response.text()

            );

        }

        const result = await response.json();

        this.shaCache[path] = result.content.sha;

        delete this.fileCache[path];

        return result;

    }

}

const githubService = new GithubService();