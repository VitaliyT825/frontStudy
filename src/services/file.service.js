import axios from 'axios';

export const fileService = {
    /**
     * Загружает файл на сервер
     * @param {File} file - файл для загрузки
     * @returns {Promise<{fileId: string, filePath: string}>} - результат загрузки
     */
    async uploadFile(file) {
        if (!file) {
            throw new Error('Файл не выбран');
        }

        // Проверяем тип файла
        const allowedTypes = [
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff',
            'image/vnd.microsoft.icon',
            'image/vnd.wap.wbmp',
            'image/webp',
            'application/pdf'
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Неподдерживаемый тип файла. Разрешены только изображения и PDF файлы.');
        }

        // Создаем FormData для отправки файла
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Загружаем файл:', file.name, 'Размер:', file.size, 'Тип:', file.type);

            // Отправляем POST запрос на /file
            const response = await axios.post('file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Ответ сервера при загрузке файла:', response);

            // Проверяем успешность ответа
            if (response.code !== 0) {
                throw new Error(response.message || 'Ошибка при загрузке файла');
            }

            const { fileId, filePath } = response.data;

            if (!fileId || !filePath) {
                throw new Error('Некорректный ответ сервера: отсутствует fileId или filePath');
            }

            console.log('Файл успешно загружен. ID:', fileId, 'Путь:', filePath);

            return {
                fileId,
                filePath
            };

        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);

            // Обрабатываем различные типы ошибок
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 400:
                        if (data.code === 1003) {
                            throw new Error('Неподдерживаемый тип файла');
                        } else if (data.code === 400) {
                            throw new Error('Файл не был загружен');
                        }
                        break;
                    case 401:
                        throw new Error('Требуется авторизация');
                    case 500:
                        throw new Error('Внутренняя ошибка сервера');
                    default:
                        throw new Error(data.message || `Ошибка HTTP ${status}`);
                }
            }

            // Если это сетевая ошибка или другая проблема
            throw new Error(error.message || 'Ошибка при загрузке файла');
        }
    },

    /**
     * Проверяет, является ли файл изображением
     * @param {File} file - файл для проверки
     * @returns {boolean} - true, если файл является изображением
     */
    isImageFile(file) {
        const imageTypes = [
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff',
            'image/vnd.microsoft.icon',
            'image/vnd.wap.wbmp',
            'image/webp'
        ];

        return imageTypes.includes(file.type);
    },

    /**
     * Форматирует размер файла в читаемый вид
     * @param {number} bytes - размер в байтах
     * @returns {string} - отформатированный размер
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Байт';

        const k = 1024;
        const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Валидирует файл перед загрузкой
     * @param {File} file - файл для валидации
     * @param {Object} options - опции валидации
     * @returns {Object} - результат валидации
     */
    validateFile(file, options = {}) {
        const {
            maxSize = 10 * 1024 * 1024, // 10MB по умолчанию
            allowedTypes = [
                'image/gif',
                'image/jpeg',
                'image/pjpeg',
                'image/png',
                'image/svg+xml',
                'image/tiff',
                'image/vnd.microsoft.icon',
                'image/vnd.wap.wbmp',
                'image/webp'
            ]
        } = options;

        const errors = [];

        if (!file) {
            errors.push('Файл не выбран');
            return { isValid: false, errors };
        }

        // Проверка типа файла
        if (!allowedTypes.includes(file.type)) {
            errors.push('Неподдерживаемый тип файла');
        }

        // Проверка размера файла
        if (file.size > maxSize) {
            errors.push(`Файл слишком большой. Максимальный размер: ${this.formatFileSize(maxSize)}`);
        }

        // Проверка имени файла
        if (file.name.length > 255) {
            errors.push('Слишком длинное имя файла');
        }

        return {
            isValid: errors.length === 0,
            errors,
            fileInfo: {
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type
            }
        };
    },

    /**
     * Получает путь к файлу по его ID
     * @param {string|number} fileId - ID файла
     * @returns {Promise<string>} - путь к файлу
     */
    async getFilePath(fileId) {
        if (!fileId) {
            throw new Error('File ID не указан');
        }

        try {
            console.log('Получаем путь к файлу для ID:', fileId);

            // Отправляем GET запрос на /file/{fileId}
            const response = await axios.get(`file/${fileId}`);

            console.log('Ответ сервера при получении пути к файлу:', response);

            // Проверяем успешность ответа
            if (response.code !== 0) {
                throw new Error(response.message || 'Ошибка при получении пути к файлу');
            }

            const filePath = response.data?.filePath || response.data;

            if (!filePath) {
                throw new Error('Некорректный ответ сервера: отсутствует путь к файлу');
            }

            console.log('Путь к файлу получен:', filePath);
            return filePath;

        } catch (error) {
            console.error('Ошибка при получении пути к файлу:', error);

            // Обрабатываем различные типы ошибок
            if (error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 404:
                        throw new Error('Файл не найден');
                    case 401:
                        throw new Error('Требуется авторизация');
                    case 500:
                        throw new Error('Внутренняя ошибка сервера');
                    default:
                        throw new Error(data?.message || `Ошибка HTTP ${status}`);
                }
            }

            // Если это сетевая ошибка или другая проблема
            throw new Error(error.message || 'Ошибка при получении пути к файлу');
        }
    },

    /**
     * Получает пути к файлам для массива ID (параллельно)
     * @param {Array<string|number>} fileIds - массив ID файлов
     * @returns {Promise<Object>} - объект вида {fileId: filePath, ...}
     */
    async getMultipleFilePaths(fileIds) {
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return {};
        }

        // Фильтруем только валидные ID
        const validFileIds = fileIds.filter(id => id && id !== null && id !== undefined);

        if (validFileIds.length === 0) {
            return {};
        }

        try {
            console.log('Получаем пути для файлов:', validFileIds);

            // Параллельно загружаем пути для всех файлов
            const promises = validFileIds.map(async (fileId) => {
                try {
                    const filePath = await this.getFilePath(fileId);
                    return { fileId, filePath };
                } catch (error) {
                    console.warn(`Не удалось получить путь для файла ${fileId}:`, error.message);
                    return { fileId, filePath: null };
                }
            });

            const results = await Promise.all(promises);

            // Преобразуем результат в объект
            const pathsMap = {};
            results.forEach(({ fileId, filePath }) => {
                pathsMap[fileId] = filePath;
            });

            console.log('Пути к файлам получены:', pathsMap);
            return pathsMap;

        } catch (error) {
            console.error('Ошибка при получении путей к файлам:', error);
            return {};
        }
    }
};