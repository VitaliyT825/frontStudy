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
                    <!-- Заголовок с названием и кнопкой редактирования -->
                    <div class="card-header">
                        <h3 class="product-title">{{item.product}}</h3>
                        <button @click="openEditModal(item)" class="edit-btn" title="Редактировать">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>

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

        <!-- Модальное окно редактирования -->
        <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h4>Редактировать товар</h4>
                    <button @click="closeEditModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <!-- Отображение ошибки -->
                    <div v-if="error" class="modal-error">
                        <p>{{error}}</p>
                    </div>

                    <!-- Компонент загрузки изображения -->
                    <ImageUpload
                        :initial-image="editForm.imageUrl"
                        :initial-image-id="editForm.imageFileId"
                        @image-uploaded="onImageUploaded"
                        @image-removed="onImageRemoved"
                    />

                    <div class="form-group">
                        <label for="productName">Название:</label>
                        <input
                            type="text"
                            id="productName"
                            v-model="editForm.name"
                            class="form-input"
                            placeholder="Введите название товара"
                        />
                    </div>

                    <div class="form-group">
                        <label for="productDescription">Описание (100 символов):</label>
                        <textarea
                            id="productDescription"
                            v-model="editForm.description"
                            class="form-textarea"
                            maxlength="100"
                            placeholder="Введите описание товара"
                            rows="3"
                        ></textarea>
                        <small class="char-counter">{{editForm.description.length}}/100</small>
                    </div>

                    <div class="form-group">
                        <label for="productPrice">Цена:</label>
                        <input
                            type="number"
                            id="productPrice"
                            v-model="editForm.price"
                            class="form-input"
                            placeholder="Введите цену"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="closeEditModal" class="btn-cancel" :disabled="loading">Отмена</button>
                    <button @click="saveProduct" class="btn-save" :disabled="loading">
                        <span v-if="loading">Сохранение...</span>
                        <span v-else>Сохранить</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import axios from "axios";
    import ImageUpload from "./ImageUpload.vue";
    import { fileService } from "@/services/file.service";

    export default {
        name: 'PricesItem',
        components: {
            ImageUpload
        },
        data() {
            return {
                prices: [],
                loading: false,
                error: null,
                showEditModal: false,
                editForm: {
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: null,
                    imageFileId: null
                },
                currentEditItem: null
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
                    const products = data.data || [];
                    console.log('Данные товаров загружены:', products);

                    // Собираем все imageId для загрузки путей к изображениям
                    const imageIds = products
                        .map(product => product.imageId)
                        .filter(id => id && id !== null);

                    console.log('Найденные imageId для загрузки:', imageIds);

                    // Параллельно загружаем пути к изображениям
                    let imagePaths = {};
                    if (imageIds.length > 0) {
                        try {
                            imagePaths = await fileService.getMultipleFilePaths(imageIds);
                            console.log('Пути к изображениям загружены:', imagePaths);
                        } catch (error) {
                            console.warn('Ошибка при загрузке путей к изображениям:', error);
                            // Продолжаем без изображений, если их загрузка не удалась
                        }
                    }

                    // Обогащаем данные товаров путями к изображениям
                    this.prices = products.map(product => ({
                        ...product,
                        image: product.imageId ? imagePaths[product.imageId] || null : null
                    }));

                    console.log('Финальные данные с изображениями:', this.prices);
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
            },
            openEditModal(item) {
                this.currentEditItem = item;
                this.editForm.name = item.product;
                this.editForm.description = item.description;
                this.editForm.price = item.basePrice[0] || 0; // Берем первую базовую цену
                this.editForm.imageUrl = item.image || null;
                this.editForm.imageFileId = item.imageId || null; // Используем imageId из API
                this.showEditModal = true;
            },
            closeEditModal() {
                this.showEditModal = false;
                this.currentEditItem = null;
                this.error = null;
                this.editForm = {
                    name: '',
                    description: '',
                    price: 0,
                    imageUrl: null,
                    imageFileId: null
                };
            },
            async saveProduct() {
                if (!this.currentEditItem || !this.currentEditItem.productId) {
                    console.error('Нет данных о редактируемом товаре');
                    return;
                }

                // Валидация формы
                if (!this.editForm.name.trim()) {
                    this.error = 'Название товара не может быть пустым';
                    return;
                }

                if (!this.editForm.description.trim()) {
                    this.error = 'Описание товара не может быть пустым';
                    return;
                }

                if (!this.editForm.price || this.editForm.price <= 0) {
                    this.error = 'Цена должна быть больше 0';
                    return;
                }

                try {
                    // Показываем состояние загрузки
                    this.loading = true;
                    this.error = null;

                    // Подготавливаем данные для отправки
                    const updateData = {
                        productName: this.editForm.name,
                        description: this.editForm.description,
                        price: this.editForm.price.toString(),
                        imageFileId: this.editForm.imageFileId || null
                    };

                    console.log('Отправляем PUT запрос:', updateData);

                    // Отправляем PUT запрос
                    const response = await axios.put(
                        `shopA/product/${this.currentEditItem.productId}`,
                        updateData
                    );

                    console.log('Ответ сервера:', response);

                    // Обновляем данные в локальном массиве
                    const itemIndex = this.prices.findIndex(p => p.productId === this.currentEditItem.productId);
                    if (itemIndex !== -1) {
                        // Обновляем локальные данные
                        this.prices[itemIndex].product = this.editForm.name;
                        this.prices[itemIndex].description = this.editForm.description;
                        // Обновляем первую базовую цену
                        this.prices[itemIndex].basePrice[0] = this.editForm.price.toString();
                        // Обновляем информацию об изображении
                        this.prices[itemIndex].imageId = this.editForm.imageFileId;
                        this.prices[itemIndex].image = this.editForm.imageUrl;
                    }

                    // Закрываем модальное окно
                    this.closeEditModal();

                    console.log('Товар успешно обновлен');

                } catch (error) {
                    console.error('Ошибка при сохранении товара:', error);
                    this.error = error.message || 'Ошибка при сохранении товара';
                } finally {
                    this.loading = false;
                }
            },

            // Обработчик успешной загрузки изображения
            onImageUploaded(imageData) {
                console.log('Изображение загружено:', imageData);
                this.editForm.imageFileId = imageData.imageId;
                this.editForm.imageUrl = imageData.imagePath;
            },

            // Обработчик удаления изображения
            onImageRemoved() {
                console.log('Изображение удалено');
                this.editForm.imageFileId = null;
                this.editForm.imageUrl = null;
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

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }

    .product-title {
        margin: 0;
        color: #333;
        font-size: 18px;
        font-weight: 600;
        flex: 1;
    }

    .edit-btn {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        margin-left: 8px;
        flex-shrink: 0;
    }

    .edit-btn:hover {
        background-color: #f0f0f0;
        color: #167bff;
        transform: scale(1.1);
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

    /* Стили для модального окна */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 0 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
    }

    .modal-header h4 {
        margin: 0;
        color: #333;
        font-size: 18px;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .close-btn:hover {
        background-color: #f0f0f0;
        color: #333;
    }

    .modal-body {
        padding: 0 20px 20px 20px;
    }

    .modal-error {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
    }

    .modal-error p {
        margin: 0;
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #333;
        font-size: 14px;
    }

    .form-input,
    .form-textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #e9ecef;
        border-radius: 5px;
        font-size: 14px;
        transition: border-color 0.2s ease;
        box-sizing: border-box;
    }

    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #167bff;
    }

    .form-textarea {
        resize: vertical;
        min-height: 80px;
    }

    .char-counter {
        display: block;
        text-align: right;
        color: #666;
        font-size: 12px;
        margin-top: 5px;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 0 20px 20px 20px;
        border-top: 1px solid #eee;
        margin-top: 20px;
        padding-top: 20px;
    }

    .btn-cancel {
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .btn-cancel:hover {
        background-color: #5a6268;
    }

    .btn-save {
        background-color: #167bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .btn-save:hover {
        background-color: #0056b3;
    }

    .btn-cancel:disabled,
    .btn-save:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-cancel:disabled:hover,
    .btn-save:disabled:hover {
        background-color: #6c757d;
    }

    .btn-save:disabled:hover {
        background-color: #167bff;
    }
</style>