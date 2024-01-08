import axios from "axios";
import {authService} from "@/services/auth.service";
import router from "@/router";

axios.defaults.baseURL = 'http://localhost:8080/backofficeapi/';
axios.interceptors.request.use(
    (config) => {
        config.headers["X-Auth-Token"] = authService.getAuthToken();

        return config;
    },
    (error) => {
        console.log('qwer');
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => {
        const { headers, data } = response;

        if (headers["x-meta-count"]) {
            return {
                data: data.data,
                count: Number(headers["x-meta-count"]),
            };
        }

        if (data.code !== 0) {
            return Promise.reject(data.message);
        }

        return data;
    },
    async (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.config &&
            !error.response.config.__isRetryRequest
        ) {
            authService.removeAuthToken();
            await router.push('/');

            throw new Error(error);
        }

        await axios.post('logout');

        return Promise.reject(error.message);
    }
);