import createApiClient from "./api.service";

class ReaderService {
    constructor(baseUrl = "/api/readers") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new ReaderService();