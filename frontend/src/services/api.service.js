import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export default (baseURL) => {
    // Ưu tiên dùng baseURL truyền vào, nếu không có thì lấy từ .env + "/api"
    const url = baseURL || (import.meta.env.VITE_API_URL + "/api");

    const instance = axios.create({
        baseURL: url,
        ...commonConfig,
    });

    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};