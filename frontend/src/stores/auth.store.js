import { defineStore } from "pinia";
import AuthService from "@/services/auth.service"; 

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
    }),
    
    getters: {
        isLoggedIn: (state) => !!state.token,
        isStaff: (state) => state.user?.role === 'ThuThu' || state.user?.role === 'QuanLy',
    },

    actions: {
        async login(credentials, role) {
            try {
                const response = await AuthService.login(credentials, role);
                
                this.token = response.token;
                this.user = response.user;

                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));

                return response;
            } catch (error) {
                this.user = null;
                this.token = null;
                throw error;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    async loginWithSocial(data) {
            try {
                const response = await AuthService.loginSocial(data);
                
                this.token = response.token;
                this.user = response.user;
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
            return response;
            } catch (error) {
                this.user = null;
                this.token = null;
                throw error;
            }   
        },
    },
});