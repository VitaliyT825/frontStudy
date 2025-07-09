<template>
    <div>
        <h3>Prices</h3>
        <div v-if="user">
            <p>Welcome, {{user.name}}!</p>

            <!-- Индикатор загрузки -->
            <div v-if="loading" class="loading">
                <p>Loading prices...</p>
            </div>

            <!-- Сообщение об ошибке -->
            <div v-if="error" class="error">
                <p>Error loading prices: {{error}}</p>
                <button @click="loadPrices" class="retry-btn">Retry</button>
            </div>

            <!-- Таблица с данными -->
            <div v-if="!loading && !error && prices.length > 0" class="table-container">
                <table class="prices-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Description</th>
                            <th>Base Price 1</th>
                            <th>Base Price 2</th>
                            <th>Base Price 3</th>
                            <th>Option Price 1</th>
                            <th>Option Price 2</th>
                            <th>Option Price 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in prices" :key="item.product">
                            <td class="product-name">{{item.product}}</td>
                            <td class="description">{{item.description}}</td>
                            <td class="price">{{formatPrice(item.basePrice[0])}}</td>
                            <td class="price">{{formatPrice(item.basePrice[1])}}</td>
                            <td class="price">{{formatPrice(item.basePrice[2])}}</td>
                            <td class="price">{{formatPrice(item.optionPrice[0])}}</td>
                            <td class="price">{{formatPrice(item.optionPrice[1])}}</td>
                            <td class="price">{{formatPrice(item.optionPrice[2])}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Сообщение, если нет данных -->
            <div v-if="!loading && !error && prices.length === 0" class="no-data">
                <p>No prices available</p>
            </div>
        </div>
        <div v-else>
            <p>Please log in to view prices.</p>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import axios from "axios";

    export default {
        name: 'PricesItem',
        data() {
            return {
                prices: [],
                loading: false,
                error: null
            }
        },
        computed: {
            ...mapGetters(['user'])
        },
        methods: {
            async loadPrices() {
                this.loading = true;
                this.error = null;

                try {
                    // Сначала пробуем основной backend, потом мок
                    let response;
                    try {
                        response = await axios.get('http://localhost:8080/backofficeapi/shopA/product');
                    } catch (backendError) {
                        console.log('Backend недоступен, используем мок:', backendError.message);
                        response = await axios.get('https://2b635504-dc32-46bf-863b-aa5f05e78e4b.mock.pstmn.io/backofficeapi/shopA/product');
                    }

                    if (response.data.code === 0) {
                        this.prices = response.data.data;
                    } else {
                        this.error = response.data.message || 'Unknown error';
                    }
                } catch (error) {
                    console.error('Error loading prices:', error);
                    this.error = error.message || 'Failed to load prices';
                } finally {
                    this.loading = false;
                }
            },
            formatPrice(price) {
                if (price === null || price === undefined) {
                    return '-';
                }
                return `$${price}`;
            }
        },
        async mounted() {
            if (this.user) {
                await this.loadPrices();
            }
        },
        watch: {
            user(newUser) {
                if (newUser) {
                    this.loadPrices();
                }
            }
        }
    }
</script>

<style scoped>
    .loading {
        text-align: center;
        padding: 20px;
        color: #666;
    }

    .error {
        background-color: #ffe6e6;
        border: 1px solid #ffcccc;
        color: #cc0000;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        text-align: center;
    }

    .retry-btn {
        background-color: #167bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }

    .retry-btn:hover {
        background-color: #0056b3;
    }

    .no-data {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }

    .table-container {
        margin-top: 20px;
        overflow-x: auto;
    }

    .prices-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
    }

    .prices-table th {
        background-color: #167bff;
        color: white;
        padding: 12px 8px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
    }

    .prices-table td {
        padding: 12px 8px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
    }

    .prices-table tr:hover {
        background-color: #f8f9fa;
    }

    .product-name {
        font-weight: 600;
        color: #333;
    }

    .description {
        color: #666;
        max-width: 200px;
    }

    .price {
        font-weight: 500;
        text-align: right;
        color: #167bff;
    }

    .price:contains('-') {
        color: #999;
    }

    /* Адаптивность для мобильных устройств */
    @media (max-width: 768px) {
        .prices-table {
            font-size: 12px;
        }

        .prices-table th,
        .prices-table td {
            padding: 8px 4px;
        }

        .description {
            max-width: 150px;
        }
    }
</style>