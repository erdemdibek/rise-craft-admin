class GithubService {
    constructor() {
        this.api = "https://api.github.com";
        this.shaCache = {};
        this.fileCache = {};
    }

    headers() {
        const token = authService.getToken();
        if (!token) {
            throw new Error("Token bulunamadı.");
        }

        return {
            Authorization: `Bearer ${token}`,
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
            // Eğer dosya henüz repoda yoksa (404) null dön, çökme yaratma
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Dosya okunamadı: ${path}`);
        }

        const file = await response.json();
        this.shaCache[path] = file.sha;
        this.fileCache[path] = file;

        return file;
    }

    async downloadJson(path, forceRefresh = false) {
        const file = await this.getFile(path, forceRefresh);
        if (!file) return null;

        // Mobil uyumlu ve Türkçe karakter güvenli Base64 Decode
        const bytes = Uint8Array.from(atob(file.content.replace(/\n/g, "")), c => c.charCodeAt(0));
        const text = new TextDecoder().decode(bytes);

        return JSON.parse(text);
    }

    async uploadJson(path, json, message) {
        // Repoda dosya var mı kontrol et, varsa SHA al
        if (!this.shaCache[path]) {
            await this.getFile(path);
        }

        // Standardize edilmiş Base64 Encode (UTF-8 Güvenli)
        const jsonString = JSON.stringify(json, null, 2);
        const bytes = new TextEncoder().encode(jsonString);
        const base64Content = btoa(String.fromCharCode(...bytes));

        const body = {
            message,
            branch: CONFIG.BRANCH,
            content: base64Content
        };

        // Eğer dosya zaten varsa SHA eklemek şarttır, yeni dosyaysa SHA gönderilmez
        if (this.shaCache[path]) {
            body.sha = this.shaCache[path];
        }

        const response = await this.request(
            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,
            {
                method: "PUT",
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Upload Hatası (${response.status}): ${errText}`);
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

        const bytes = new TextEncoder().encode(text);
        const base64Content = btoa(String.fromCharCode(...bytes));

        const body = {
            message,
            branch: CONFIG.BRANCH,
            content: base64Content
        };

        if (this.shaCache[path]) {
            body.sha = this.shaCache[path];
        }

        const response = await this.request(
            `${this.api}/repos/${CONFIG.OWNER}/${CONFIG.REPO}/contents/${path}`,
            {
                method: "PUT",
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Upload Hatası (${response.status}): ${errText}`);
        }

        const result = await response.json();
        this.shaCache[path] = result.content.sha;
        delete this.fileCache[path];

        return result;
    }
}

const githubService = new GithubService();
