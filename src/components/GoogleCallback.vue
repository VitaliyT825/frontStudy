<template>
    <div class="container mt-5">
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-3">Completing Google authentication...</p>
        </div>
    </div>
</template>

<script>
import { authService } from "@/services/auth.service";

export default {
    name: 'GoogleCallback',
    async mounted() {
        try {
            // Получаем code и state из URL
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            if (!code || !state) {
                throw new Error('Missing code or state parameter');
            }

            // Отправляем на бэкенд для обмена на токен
            const token = await authService.handleGoogleCallback(code, state);

            // Сохраняем токен
            authService.setAuthToken(token);

            // Редирект на главную или prices
            await this.$router.push('/prices');
        } catch (error) {
            console.error('Google OAuth error:', error);
            alert('Authentication failed: ' + (error.message || 'Unknown error'));
            await this.$router.push('/login');
        }
    }
}
</script>

