import createApiClient from "./api.service";

class ReaderService {
    constructor(baseUrl = "/api/readers") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(params) {
        return (await this.api.get("/", { params })).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new ReaderService();