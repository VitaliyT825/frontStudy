<template>
    <div class="prices-page">
        <div class="prices-header">
            <h2>Product Prices</h2>
            <p v-if="user" class="welcome-text">Welcome, {{user.name}}!</p>
        </div>

        <div v-if="user" class="prices-content">
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
                            <th>Image</th>
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
                            <td class="image-cell">
                                <div class="image-container">
                                    <img
                                        v-if="item.image && item.image.trim()"
                                        :src="item.image"
                                        :alt="item.product"
                                        class="product-image"
                                        @error="handleImageError"
                                    />
                                    <div v-else class="no-image">
                                        <span>No image</span>
                                    </div>
                                </div>
                            </td>
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

        <div v-else class="login-prompt">
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
                    console.log('Загружаем данные с backend...');
                    // Axios interceptor автоматически обрабатывает ответ
                    const data = await axios.get('shopA/product');
                    console.log('Backend ответил:', data);
                    // Interceptor уже проверил code и вернул data.data
                    this.prices = data.data || [];
                    console.log('Данные загружены успешно:', this.prices);
                } catch (error) {
                    console.error('Error loading prices:', error);
                    this.error = error || 'Failed to load prices';
                } finally {
                    this.loading = false;
                }
            },
            formatPrice(price) {
                if (price === null || price === undefined) {
                    return '-';
                }
                return `$${price}`;
            },
            handleImageError(event) {
                console.warn('Failed to load image:', event.target.src);
                // Заменяем сломанное изображение на placeholder
                event.target.style.display = 'none';
                event.target.nextElementSibling.style.display = 'flex';
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
    .prices-page {
        min-height: 100vh;
        padding: 20px;
    }

    .prices-header {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 30px;
        text-align: center;
    }

    .prices-header h2 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 28px;
    }

    .welcome-text {
        margin: 0;
        color: #666;
        font-size: 16px;
    }

    .prices-content {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 18px;
    }

    .error {
        background-color: #ffe6e6;
        border: 1px solid #ffcccc;
        color: #cc0000;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
    }

    .retry-btn {
        background-color: #167bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 15px;
        font-size: 14px;
    }

    .retry-btn:hover {
        background-color: #0056b3;
    }

    .no-data {
        text-align: center;
        padding: 40px;
        color: #666;
        font-style: italic;
        font-size: 18px;
    }

    .login-prompt {
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
        font-size: 18px;
        color: #666;
    }

    .table-container {
        margin-top: 20px;
        overflow-x: auto;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .prices-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        min-width: 800px; /* Минимальная ширина для горизонтального скролла */
    }

    .prices-table th {
        background-color: #167bff;
        color: white;
        padding: 15px 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
    }

    .prices-table td {
        padding: 15px 12px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        vertical-align: middle;
    }

    .prices-table tr:hover {
        background-color: #f8f9fa;
    }

    .prices-table tr:last-child td {
        border-bottom: none;
    }

    .image-cell {
        width: 80px;
        text-align: center;
    }

    .image-container {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
        border: 2px solid #e9ecef;
    }

    .no-image {
        width: 100%;
        height: 100%;
        background-color: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #6c757d;
        text-align: center;
    }

    .product-name {
        font-weight: 600;
        color: #333;
        min-width: 120px;
    }

    .description {
        color: #666;
        max-width: 250px;
        line-height: 1.4;
    }

    .price {
        font-weight: 500;
        text-align: right;
        color: #167bff;
        min-width: 80px;
        font-family: 'Courier New', monospace;
    }

    .price:contains('-') {
        color: #999;
    }

    /* Адаптивность для планшетов */
    @media (max-width: 1024px) {
        .prices-page {
            padding: 15px;
        }

        .prices-header {
            padding: 20px;
        }

        .prices-content {
            padding: 20px;
        }
    }

    /* Адаптивность для мобильных устройств */
    @media (max-width: 768px) {
        .prices-page {
            padding: 10px;
        }

        .prices-header {
            padding: 15px;
        }

        .prices-header h2 {
            font-size: 24px;
        }

        .prices-content {
            padding: 15px;
        }

        .prices-table {
            font-size: 12px;
            min-width: 600px;
        }

        .prices-table th,
        .prices-table td {
            padding: 10px 6px;
        }

        .image-container {
            width: 40px;
            height: 40px;
        }

        .description {
            max-width: 150px;
            font-size: 11px;
        }

        .price {
            font-size: 12px;
        }
    }
</style>