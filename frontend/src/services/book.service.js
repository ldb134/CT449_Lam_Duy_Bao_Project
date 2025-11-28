import createApiClient from "./api.service";

class BookService {
    constructor(baseUrl = "/api/books") {
        this.api = createApiClient(baseUrl);
    }

    async getAll(params) {
        return (await this.api.get("/", { params })).data;
    }

    async getTopBorrowed() {
        return (await this.api.get("/top-borrowed")).data;
    }

    async getNew() {
        return (await this.api.get("/new")).data;
    }

    async getAllYears() {
        return (await this.api.get("/years")).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async create(data) {
        return (await this.api.post("/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default new BookService();