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
            // Передаем полный объект ошибки с кодом и сообщением
            return Promise.reject({
                code: data.code,
                message: data.message,
                textCode: data.textCode,
                data: data.data,
            });
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

        // Если есть response с данными от бэкенда (ошибка с кодом)
        if (error.response && error.response.data) {
            const { code, message, textCode, data } = error.response.data;
            return Promise.reject({
                code: code || 2000,
                message: message || 'Произошла ошибка',
                textCode: textCode,
                data: data,
            });
        }

        // await axios.post('logout');

        return Promise.reject(error.message || 'Произошла ошибка при выполнении запроса');
    }
);