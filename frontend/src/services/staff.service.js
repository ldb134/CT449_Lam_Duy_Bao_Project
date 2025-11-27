import createApiClient from "./api.service";

class StaffService {
    constructor(baseUrl = "/api/staff") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(params) {
        return (await this.api.get("/", { params })).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new StaffService();