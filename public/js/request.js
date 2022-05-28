/**
 * На экран с разрешением FULL HD помещается 6 элементов типа content items
 */

export const REQUESTED_ITEMS_FOR_PAGE_LIMIT = 6;

/**
 * На экран с разрешением FULL HD помещается 6 элементов типа content items
 * У content items обычно есть две версии: с цензурой и без
 */

export const REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS = REQUESTED_ITEMS_FOR_PAGE_LIMIT * 2;

/**
 * Максимальное количество возвращаемых с сервера Spotify элементов
 */

export const MAX_REQUESTED_ITEMS_LIMIT = 50;

/**
 * Функция-обертка fetch. С необходимым заголовком для Spotify.
 * @param {string} url Ссылка для запроса. 
 * @returns {Promise<object>} Результат запроса.
 */

export function request(url) {
    return fetch(url, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    });
}