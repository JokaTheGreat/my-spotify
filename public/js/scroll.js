/**
 * Функция-обертка для плавного скролла к верху страницы.
 * @returns Команда скролла.
 */

export function scrollToTop() {
    return document.getElementsByClassName('main')[0].scroll({ top: 0, behavior: "smooth" });
}