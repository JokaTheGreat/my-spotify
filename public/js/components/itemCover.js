/**
 * Создает элемент-обложку исполнителя или альбома по переданным параметрам.
 * Либо возвращает дефолтную обложку, если обложка не была передана.
 * @param {string | null} coverURL Ссылка на обложку, может быть равна null. 
 * @param {string} alt Значение аттрибута alt элемента img, дефолтное значение = 'cover'. 
 * @returns {HTMLElement} Элемент-обложка исполнителя или альбома.
 */

export function parseItemCover(coverURL, alt = 'cover') {
    if (coverURL) {
        const cover = document.createElement('img');
        cover.className = 'content-item__img';
        cover.setAttribute('alt', alt);
        cover.setAttribute('src', coverURL);

        return cover;
    }

    const cover = document.createElement('svg');
    cover.classList.add('content-item__img', 'artist-img-default');
    cover.setAttribute('height', '125px');
    cover.setAttribute('width', '125px');
    cover.insertAdjacentHTML('beforeend', `<use xlink:href="imgs/icons/icons.svg#artist"></use>`);

    return cover;
}