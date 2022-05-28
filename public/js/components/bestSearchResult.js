import { albumPage } from './albumPage.js';
import { artistPage } from './artistPage.js';
import { parseItemCover } from './itemCover.js';
import { loadTrack } from './../player.js';

/**
 * Создает секцию с лучший результатом для страницы поиска.
 * Приоритет: артист > альбом > трек.
 * @param {object} searchData Данные полученные с сервера Spotify: данные треков(tracks: { items: Array<object> }),
 * данные альбомов(albums: { items: Array<object> }), данные исполнителей(artists: { items: Array<object> }).
 * @returns {HTMLElement} Элемент-секция с лучшим результатом поиска.
 */

export function parseBestSearchResult(searchData) {
    const bestResult = document.createElement('section');
    bestResult.className = 'best-search-result';

    const bestResultHeader = document.createElement('h2');
    bestResultHeader.className = 'best-search-result__title';
    bestResultHeader.insertAdjacentText('beforeend', 'Лучший результат');
    
    bestResult.append(bestResultHeader);

    const bestResultBody = document.createElement('div');
    bestResultBody.className = 'best-search-result__container';

    let title;
    let coverURL;
    let subtitle;
    let type;

    if (searchData.artists.total) {
        const firstArtist = searchData.artists.items[0];
        coverURL = firstArtist.images[0] ? firstArtist.images[0].url : null;
        title = firstArtist.name;
        type = 'Исполнитель';

        bestResultBody.addEventListener('click', () => artistPage(firstArtist.id));
    }
    else if (searchData.albums.total) {
        const firstAlbum = searchData.albums.items[0];
        coverURL = firstAlbum.images[0] ? firstAlbum.images[0].url : null;
        title = firstAlbum.name;
        subtitle = firstAlbum.artists[0].name;
        type = 'Альбом';

        bestResultBody.addEventListener('click', () => albumPage(firstAlbum));
    }
    else if (searchData.tracks.total) {
        const firstTrack = searchData.tracks.items[0];
        coverURL = firstTrack.album.images[0].url;
        title = firstTrack.name;
        subtitle = firstTrack.artists[0].name;
        type = 'Трек';
        
        bestResultBody.addEventListener('click', () => loadTrack(0));
    }
    else {
        return bestResult;
    }

    const extraInfoTag = document.createElement('div');
    extraInfoTag.className = 'best-search-result__extra-info';

    if (subtitle) {
        const subtitleTag = document.createElement('h3');
        subtitleTag.className = 'best-search-result__subtitle';
        subtitleTag.insertAdjacentText('beforeend', subtitle);

        extraInfoTag.append(subtitleTag);
    }
    const typeTag = document.createElement('h3');
    typeTag.className = 'best-search-result__type';
    typeTag.insertAdjacentText('beforeend', type);

    extraInfoTag.append(typeTag);

    bestResultBody.insertAdjacentHTML('beforeend', `
        <div class="best-search-result__img-container">
            ${parseItemCover(coverURL, title).outerHTML}
        </div>
        <div class="best-search-result__play play-button">
            <svg class="play-button__svg" height="24px" width="24px">
                <use xlink:href="imgs/icons/icons.svg#play"></use>
            </svg>
        </div>
        <h2 class="best-search-result__title">${title}</h2>
        ${extraInfoTag.outerHTML}
    `);
    
    bestResult.append(bestResultBody);
    return bestResult;
}