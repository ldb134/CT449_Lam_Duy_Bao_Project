import createApiClient from "./api.service";

class TransactionService {
    constructor(baseUrl = "/api/transactions") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }
}

export default new TransactionService();