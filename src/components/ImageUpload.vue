<template>
    <div class="image-upload-component">
        <div class="form-group">
            <label for="imageUpload">Изображение:</label>

            <!-- Превью загруженного изображения -->
            <div v-if="imagePreview" class="image-preview-container">
                <img :src="imagePreview" alt="Preview" class="image-preview" />
                                <button
                    @click="removeImage"
                    class="remove-image-btn"
                    type="button"
                    :disabled="uploading"
                    title="Удалить изображение"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <!-- Загрузка файла -->
            <div v-else class="upload-area">
                <input
                    id="imageUpload"
                    ref="fileInput"
                    type="file"
                    @change="onFileSelect"
                    accept="image/gif,image/jpeg,image/pjpeg,image/png,image/svg+xml,image/tiff,image/vnd.microsoft.icon,image/vnd.wap.wbmp,image/webp"
                    class="file-input"
                    :disabled="uploading"
                />
                <label for="imageUpload" class="upload-label" :class="{ disabled: uploading }">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span v-if="uploading">Загрузка...</span>
                    <span v-else>Выбрать изображение</span>
                </label>
            </div>

            <!-- Индикатор загрузки -->
            <div v-if="uploading" class="upload-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <span class="progress-text">Загружается...</span>
            </div>

            <!-- Ошибка загрузки -->
            <div v-if="uploadError" class="upload-error">
                <p>{{ uploadError }}</p>
                <button @click="clearError" class="clear-error-btn">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script>
import { fileService } from '@/services/file.service';

export default {
    name: 'ImageUpload',
    props: {
        // Существующее изображение (URL)
        initialImage: {
            type: String,
            default: null
        },
        // ID существующего изображения
        initialImageId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            uploading: false,
            uploadError: null,
            imagePreview: null,
            currentImageId: null
        };
    },
    watch: {
        initialImage: {
            immediate: true,
            handler(newValue) {
                this.imagePreview = newValue;
            }
        },
        initialImageId: {
            immediate: true,
            handler(newValue) {
                this.currentImageId = newValue;
            }
        }
    },
    methods: {
        async onFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Валидируем файл с помощью сервиса
            const validation = fileService.validateFile(file);

            if (!validation.isValid) {
                this.uploadError = validation.errors.join(', ');
                return;
            }

            await this.uploadFile(file);
        },

                async uploadFile(file) {
            this.uploading = true;
            this.uploadError = null;

            try {
                // Используем сервис для загрузки файла
                const result = await fileService.uploadFile(file);

                this.currentImageId = result.fileId;
                this.imagePreview = result.filePath;

                // Сообщаем родительскому компоненту об успешной загрузке
                this.$emit('image-uploaded', {
                    imageId: result.fileId,
                    imagePath: result.filePath
                });

                // Очищаем input
                this.$refs.fileInput.value = '';

            } catch (error) {
                console.error('Ошибка загрузки файла:', error);
                this.uploadError = error.message || 'Ошибка при загрузке файла';
            } finally {
                this.uploading = false;
            }
        },

        removeImage() {
            this.imagePreview = null;
            this.currentImageId = null;
            this.uploadError = null;

            // Сообщаем родительскому компоненту об удалении изображения
            this.$emit('image-removed');
        },

        clearError() {
            this.uploadError = null;
        },

        // Метод для получения текущего ID изображения
        getCurrentImageId() {
            return this.currentImageId;
        }
    }
};
</script>

<style scoped>
.image-upload-component {
    width: 100%;
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

.image-preview-container {
    position: relative;
    display: inline-block;
    margin-bottom: 10px;
}

.image-preview {
    max-width: 200px;
    max-height: 150px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid #e9ecef;
}

.remove-image-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.remove-image-btn:hover {
    background-color: #c82333;
    transform: scale(1.1);
}

.remove-image-btn svg {
    width: 14px;
    height: 14px;
}

.upload-area {
    position: relative;
}

.file-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 30px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f8f9fa;
    color: #6c757d;
    min-height: 120px;
}

.upload-label:hover {
    border-color: #167bff;
    background-color: #f0f8ff;
    color: #167bff;
}

.upload-label.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.upload-label.disabled:hover {
    border-color: #dee2e6;
    background-color: #f8f9fa;
    color: #6c757d;
}

.upload-label svg {
    margin-bottom: 8px;
}

.upload-progress {
    margin-top: 10px;
    text-align: center;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background-color: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background-color: #167bff;
    border-radius: 2px;
    animation: progress-animation 1.5s ease-in-out infinite;
}

@keyframes progress-animation {
    0% {
        width: 0%;
        margin-left: 0%;
    }
    50% {
        width: 75%;
        margin-left: 25%;
    }
    100% {
        width: 0%;
        margin-left: 100%;
    }
}

.progress-text {
    font-size: 12px;
    color: #6c757d;
}

.upload-error {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
}

.upload-error p {
    margin: 0 0 8px 0;
    font-size: 14px;
}

.clear-error-btn {
    background-color: transparent;
    border: 1px solid #721c24;
    color: #721c24;
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
}

.clear-error-btn:hover {
    background-color: #721c24;
    color: white;
}

/* Адаптивность */
@media (max-width: 768px) {
    .image-preview {
        max-width: 150px;
        max-height: 120px;
    }

    .upload-label {
        padding: 20px 15px;
        min-height: 100px;
    }
}
</style>