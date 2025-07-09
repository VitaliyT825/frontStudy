<template>
    <div class="auth-layout">
        <div class="auth-wrapper">
            <div class="auth-inner">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthLayout'
}
</script>

<style scoped>
    .auth-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .auth-wrapper {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: left;
    }

    .auth-inner {
        width: 450px;
        background: #ffffff;
        box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
        padding: 40px 55px 45px 55px;
        border-radius: 15px;
        transition: all .3s;
    }

    /* Адаптивность для мобильных устройств */
    @media (max-width: 768px) {
        .auth-inner {
            width: 90%;
            padding: 30px 25px 35px 25px;
            margin: 20px;
        }
    }
</style>