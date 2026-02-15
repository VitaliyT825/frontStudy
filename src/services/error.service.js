/**
 * Маппинг кодов ошибок бэкенда на пользовательские сообщения
 */
const ERROR_CODE_MESSAGES = {
    1008: 'Срок действия сессии истек. Пожалуйста, попробуйте войти снова.',
    2000: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
    // Добавьте другие коды ошибок по мере необходимости
};

/**
 * Получить сообщение об ошибке по коду или использовать fallback
 * @param {number} code - Код ошибки от бэкенда
 * @param {string} fallbackMessage - Сообщение из response.message (используется если код не найден)
 * @returns {string} Пользовательское сообщение об ошибке
 */
export const getErrorMessage = (code, fallbackMessage = 'Произошла неизвестная ошибка') => {
    if (code && ERROR_CODE_MESSAGES[code]) {
        return ERROR_CODE_MESSAGES[code];
    }

    return fallbackMessage || 'Произошла неизвестная ошибка';
};

/**
 * Обработать ошибку от бэкенда
 * @param {Object} errorResponse - Объект ошибки от axios
 * @returns {string} Пользовательское сообщение об ошибке
 */
export const handleBackendError = (errorResponse) => {
    // Если ошибка пришла из axios interceptor (уже обработанная)
    if (typeof errorResponse === 'string') {
        return errorResponse;
    }

    // Если это объект с code и message
    if (errorResponse && typeof errorResponse === 'object') {
        const code = errorResponse.code;
        const message = errorResponse.message;
        return getErrorMessage(code, message);
    }

    // Если это axios error response
    if (errorResponse?.response?.data) {
        const { code, message } = errorResponse.response.data;
        return getErrorMessage(code, message);
    }

    // Fallback
    return errorResponse?.message || 'Произошла неизвестная ошибка';
};

