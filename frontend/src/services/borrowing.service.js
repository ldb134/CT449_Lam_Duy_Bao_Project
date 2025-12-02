import createApiClient from "./api.service";

class BorrowingService {
    constructor(baseUrl = "/api/borrowing") {
        this.api = createApiClient(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async getAll(params) { 
        return (await this.api.get("/", { params })).data;
    }

    async approve(id) {
        return (await this.api.put(`/${id}/approve`)).data;
    }

    async returnBook(id) {
        return (await this.api.put(`/${id}/return`)).data;
    }

    async reject(id) {
        return (await this.api.put(`/${id}/reject`)).data;
    }
    
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async renew(id) {
        return (await this.api.put(`/${id}/renew`)).data;
    }
}

export default new BorrowingService();