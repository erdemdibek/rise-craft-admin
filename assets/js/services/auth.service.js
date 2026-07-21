class AuthService {
    constructor() {
        this.key = "github_pat";
    }

    /**
     * Kayıtlı token'ı getirir. Yoksa tek seferlik ister.
     * Sonsuz döngüden kaçınmak için mobil dostu kontrol mekanizması.
     */
    getToken() {
        let token = localStorage.getItem(this.key);

        if (!token) {
            token = prompt("GitHub Personal Access Token (PAT) giriniz:");

            if (!token || !token.trim()) {
                console.warn("GitHub Token girilmedi.");
                return null;
            }

            token = token.trim();
            this.setToken(token);
        }

        return token;
    }

    /**
     * Token'ın var olup olmadığını kontrol eder (Boolean)
     */
    isAuthenticated() {
        const token = localStorage.getItem(this.key);
        return Boolean(token && token.trim().length > 0);
    }

    /**
     * Yeni token kaydeder
     */
    setToken(token) {
        if (token && token.trim()) {
            localStorage.setItem(this.key, token.trim());
        }
    }

    /**
     * Kayıtlı token'ı siler (Çıkış Yap / Reset)
     */
    clearToken() {
        localStorage.removeItem(this.key);
    }

    /**
     * Hatalı veya süresi dolmuş token durumunda kullanıcıdan yeni token ister
     */
    promptNewToken() {
        this.clearToken();
        return this.getToken();
    }
}

const authService = new AuthService();
