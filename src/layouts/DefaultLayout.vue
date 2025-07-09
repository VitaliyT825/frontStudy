<template>
    <div class="default-layout">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout'
}
</script>

<style scoped>
    .default-layout {
        min-height: 100vh;
        width: 100%;
        background-color: #f8f9fa;
        padding-top: 80px; /* Отступ для фиксированной навигации */
    }
</style>