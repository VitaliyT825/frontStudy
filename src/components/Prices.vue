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

                        <!-- Карточки товаров -->
            <div v-if="!loading && !error && prices.length > 0" class="cards-container">
                <div v-for="item in prices" :key="item.product" class="product-card">
                    <!-- Название товара -->
                    <h3 class="product-title">{{item.product}}</h3>

                    <!-- Изображение товара -->
                    <div class="card-image-container">
                        <img
                            v-if="item.image && item.image.trim()"
                            :src="item.image"
                            :alt="item.product"
                            class="card-product-image"
                            @error="handleImageError"
                        />
                        <div v-else class="card-no-image">
                            <span>No image</span>
                        </div>
                    </div>

                    <!-- Новая цена (Base Price) -->
                    <span class="spanoran">Новая</span>
                    <div class="price-table-container">
                        <table class="tabprice">
                            <thead>
                                <tr>
                                    <th>Base Price 1</th>
                                    <th>Base Price 2</th>
                                    <th>Base Price 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td :class="{'green-price': item.basePrice[0]}">{{formatPriceRub(item.basePrice[0])}}</td>
                                    <td>{{formatPriceRub(item.basePrice[1])}}</td>
                                    <td>{{formatPriceRub(item.basePrice[2])}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <br>

                    <!-- Старая цена (Option Price) -->
                    <span class="spanred">Старая</span>
                    <div class="price-table-container">
                        <table class="tabprice">
                            <thead>
                                <tr>
                                    <th>Option Price 1</th>
                                    <th>Option Price 2</th>
                                    <th>Option Price 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td :class="{'green-price': item.optionPrice[0]}">{{formatPriceRub(item.optionPrice[0])}}</td>
                                    <td>{{formatPriceRub(item.optionPrice[1])}}</td>
                                    <td>{{formatPriceRub(item.optionPrice[2])}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                                        <!-- Описание -->
                    <div class="product-description">{{item.description}}</div>
                </div>
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
            formatPriceRub(price) {
                if (price === null || price === undefined) {
                    return '-';
                }
                return `${price} р.`;
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
        min-height: calc(100vh - 80px); /* Вычитаем высоту навигации */
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

    .cards-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-top: 20px;
        max-width: 1200px; /* Ограничиваем максимальную ширину для 4 карточек */
        margin-left: auto;
        margin-right: auto;
    }

    .product-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 1px solid #e9ecef;
    }

    .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }

    .product-title {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 18px;
        font-weight: 600;
    }

    .card-image-container {
        margin-bottom: 15px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-product-image {
        max-width: 100%;
        max-height: 110px;
        object-fit: contain;
        border-radius: 6px;
    }

    .card-no-image {
        width: 100%;
        height: 110px;
        background-color: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #6c757d;
    }

    .spanoran {
        background-color: #ffa000;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 10px;
    }

    .spanred {
        background-color: #d32f2f;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
        margin-bottom: 10px;
    }

    .price-table-container {
        margin-bottom: 15px;
    }

    .tabprice {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid white;
        font-size: 11px;
        margin: 5px 0;
        padding: 0px;
    }

    .tabprice th {
        padding: 3px;
        border: 1px solid maroon;
        text-align: center;
        font-weight: bold;
        font-size: 10px;
        color: #333;
        background-color: #f5f5f5;
        display: table-cell;
        vertical-align: inherit;
    }

    .tabprice td {
        padding: 3px;
        border: 1px solid maroon;
        text-align: center;
        font-size: 11px;
    }

    .green-price {
        color: green !important;
        font-weight: 600;
    }

    .product-description {
        color: #ffa000;
        font-size: 12px;
        margin: 10px 0;
        min-height: 20px;
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

        .cards-container {
            grid-template-columns: repeat(2, 1fr);
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

        .cards-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .product-card {
            padding: 15px;
        }

        .product-title {
            font-size: 16px;
        }

        .card-image-container {
            height: 90px;
        }

        .card-product-image {
            max-height: 90px;
        }

        .card-no-image {
            height: 90px;
        }

        .tabprice {
            font-size: 10px;
        }

        .tabprice th,
        .tabprice td {
            padding: 2px;
            font-size: 9px;
            border: 1px solid maroon;
        }
    }

    /* Для очень маленьких экранов - по 1 карточке */
    @media (max-width: 480px) {
        .cards-container {
            grid-template-columns: 1fr;
        }
    }
</style>