import createApiClient from "./api.service";

class TransactionService {
    constructor(baseUrl = "/api/transactions") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(params) {
        return (await this.api.get("/", { params })).data;
    }
}

export default new TransactionService();