import createApiClient from "./api.service";

class AuthService {
    constructor(baseUrl = "/api/auth") {
        this.api = createApiClient(baseUrl);
    }

    async register(data) {
        return (await this.api.post("/register", data)).data;
    }

    async login(credentials, role = 'reader') {
        const endpoint = role === 'staff' ? '/login/staff' : '/login/reader';
        return (await this.api.post(endpoint, credentials)).data;
    }

    async changePassword(data) {
        return (await this.api.post("/change-password", data)).data;
    }
}

export default new AuthService();