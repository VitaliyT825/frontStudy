<template>
    <div>
        <h3>Prices</h3>
        <div v-if="user">
            <p>Welcome, {{user.name}}!</p>
            <!-- Здесь будет таблица с данными от backend -->
        </div>
        <div v-else>
            <p>Please log in to view prices.</p>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'PricesItem',
        computed: {
            ...mapGetters(['user'])
        }
    }
</script>

<style scoped>
    /* Стили для будущей таблицы */
</style>