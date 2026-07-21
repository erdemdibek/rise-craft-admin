class AuthService {

    constructor() {

        this.key = "github_pat";

    }

    getToken() {

        let token = localStorage.getItem(this.key);

        while (!token) {

            token = prompt(
                "GitHub Personal Access Token (PAT) giriniz:"
            );

            if (token === null) {
                throw new Error("GitHub token girilmedi.");
            }

            token = token.trim();

            if (!token)
                continue;

            localStorage.setItem(this.key, token);
        }

        return token;
    }

    clearToken() {

        localStorage.removeItem(this.key);

    }

}

const authService = new AuthService();