class GithubService {

    constructor() {

        this.api = "https://api.github.com";

        this.shaCache = {};

        this.fileCache = {};

    }

    headers() {

        return {

            Authorization: `Bearer ${authService.getToken()}`,

            Accept: "application/vnd.github+json",

            "Content-Type": "application/json"

        };

    }

    clearCache() {

        this.shaCache = {};

        this.fileCache = {};

    }

    async request(url, options = {}) {

        const response = await fetch(url, {

            ...options,

            headers: {

                ...this.headers(),

                ...(options.headers || {})

            }

        });

        if (response.status === 401) {

            authService.clearToken();

            alert("GitHub token geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın.");

            location.reload();

            throw new Error("Unauthorized");

        }

        return response;

    }

    async getFile(path, forceRefresh = false) {

        if (!forceRefresh && this.fileCache[path]) {

            return this.fileCache[path];

        }

        const response = await this.request(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}?ref=${CONFIG.BRANCH}`

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

    const text = decodeURIComponent(
        escape(
            atob(file.content)
        )
    );

    return JSON.parse(text);

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
    unescape(
        encodeURIComponent(
            JSON.stringify(json, null, 2)
        )
    )
)
        };

        const response = await this.request(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,

            {

                method: "PUT",

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error(await response.text());

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

        const response = await this.request(

            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,

            {

                method: "PUT",

                body: JSON.stringify(body)

            }

        );

        if (!response.ok) {

            throw new Error(await response.text());

        }

        const result = await response.json();

        this.shaCache[path] = result.content.sha;

        delete this.fileCache[path];

        return result;

    }

}

const githubService = new GithubService();