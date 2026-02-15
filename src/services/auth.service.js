import axios from 'axios';

const  tokenKey = 'token';

export const authService = {
    getAuthToken: () => {
        return localStorage.getItem(tokenKey);
    },
    setAuthToken: (token) => {
        return localStorage.setItem(tokenKey, token);
    },
    removeAuthToken: () => {
        return localStorage.removeItem(tokenKey);
    },

    // Google OAuth methods
    initGoogleAuth: async () => {
        const response = await axios.post('auth/google/init');
        return response.data.authUrl;
    },

    handleGoogleCallback: async (code, state) => {
        const response = await axios.post('auth/google/callback', {
            code,
            state
        });
        return response.data.token;
    }
}