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
}