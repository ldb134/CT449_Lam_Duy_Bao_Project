import createApiClient from "./api.service";
class NotificationService {
    constructor(baseUrl = "/api/notifications") { this.api = createApiClient(baseUrl); }
    async getMine() { return (await this.api.get("/")).data; }
    async markRead(id) { return (await this.api.put(`/${id}/read`)).data; }
}
export default new NotificationService();