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