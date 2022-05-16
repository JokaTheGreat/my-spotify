import { loadTrack } from './../player.js';
import { timeToString } from "../time.js";
import { arrayToSpanArray } from "../array.js";

/**
 * Создает шапку секции треков для страницы поиска.
 * @returns {HTMLElement} Шапка секции треков страницы поиска.
 */

function parseSearcPageTracksHeader() {
    const tracksHeader = document.createElement('div');
    tracksHeader.className = 'tracks-search-result__header';
    tracksHeader.innerHTML = `
        <h2 class="tracks-search-result__title">Треки</h2>
    `;

    const showAllTag = document.createElement('span');
    showAllTag.className = 'content-items__show-all';
    showAllTag.innerHTML = 'Все';

    showAllTag.addEventListener('click', () => { console.log('Все') });

    tracksHeader.append(showAllTag);

    return tracksHeader;
}

/**
 * Создает шапку секции треков для страниц альбомов.
 * @returns {Array<HTMLElement>} Массив из двух элементов - частей шапки секции треков страницы альбома.
 */

function parseAlbumPageTracksHeader() {
    const tracksHeader = document.createElement('div');
    tracksHeader.className = 'track-list__header';
    tracksHeader.innerHTML = `
        <div class="track-list__header-left">
            <div class="track-list__number">#</div>
            <div class="track-list__name">Название</div>
        </div>
        <div class="track-list__header-right">
            <svg height="16px" width="16px" class="track-list__length">
                <use xlink:href="imgs/icons/icons.svg#clock"></use>
            </svg>
        </div>
    `;

    const tracksControls = document.createElement('div');
    tracksControls.className = 'track-list__controls';
    tracksControls.innerHTML = `
        <div class="play-button__container">
            <div class="play-button_block">
                <svg height="30px" width="30px" class="play-button__svg">
                    <use xlink:href="imgs/icons/icons.svg#play"></use>
                </svg>
            </div>
        </div>
        <svg height="30px" width="30px" class="album-page__favourite">
            <use xlink:href="imgs/icons/icons.svg#heart"></use>
        </svg>
        <svg height="24px" width="24px" class="album-page__other">
            <use xlink:href="imgs/icons/icons.svg#other"></use>
        </svg>
    `;

    return [tracksControls, tracksHeader];
}

/**
 * Создает шапку секции треков для страниц исполнителей.
 * @returns {Array<HTMLElement>} Массив из двух элементов - частей шапки секции треков страницы исполнителя.
 */

function parseArtistPageTracksHeader() {
    const artistPageControls = document.createElement('div');
    artistPageControls.className = 'artist-page__controls';
    artistPageControls.innerHTML = `
        <div class="play-button__container">
            <div class="play-button_block">
                <svg height="30px" width="30px" class="play-button__svg">
                    <use xlink:href="imgs/icons/icons.svg#play"></use>
                </svg>
            </div>
        </div>
        <div class="artist-page__subscribe-button">Подписаться</div>
        <svg height="24px" width="24px" class="artist-page__other">
            <use xlink:href="imgs/icons/icons.svg#other"></use>
        </svg>
    `;

    const tracksTitle = document.createElement('h2');
    tracksTitle.className = 'popular-tracks__title';
    tracksTitle.innerHTML = 'Популярные треки';

    return [artistPageControls, tracksTitle];
}

/**
 * Сохраняет в localStorage массив объектов с данными треков вида: ссылка на обложку(coverURL: string), 
 * название трека(title: string), имена исполнителей(artists: Array<string>),
 * ссылка на трек(audioPreviesURL: string).
 * @param {Array<object>} tracksData Массив объектов с данными треков: название(name: string), 
 * данные исполнителей(artists: Array<{ name: string }>), 
 * данные альбома(album: { images: Array<{ url: string, width: number, height: number }> }),
 * продолжительность трека в миллисекундах(duration_ms: number), 18+(explicit: boolean).
 */

function saveTracksDataToLocalStorage(tracksData) {
    const tracksToLocalStorage = tracksData.map((item) => {
        return {
            coverURL: item.album.images[0].url,
            title: item.name,
            artists: item.artists.map(artist => artist.name),
            audioPreviewURL: item.preview_url
        }
    });

    localStorage.setItem('tracksData', JSON.stringify(tracksToLocalStorage));
}

/**
 * Создает массив треков-секций с определенными параметрами.
 * Сохраняет данные треков в localStorage.
 * @param {Array<object>} tracksData Массив объектов с данными треков: название(name: string), 
 * данные исполнителей(artists: Array<{ name: string }>), 
 * данные альбома(album: { images: Array<{ url: string, width: number, height: number }> }),
 * продолжительность трека в миллисекундах(duration_ms: number), 18+(explicit: boolean).
 * @param {boolean} includeTracksCover Параметр-флаг добавляет обложку трека.
 * @param {boolean} includeTracksNumber Параметр-флаг добавляет номер трека.
 * @returns {Array<HTMLElement>} Массив с тегами article.
 */

function parseTrackItems(tracksData, includeTracksCover = true, includeTracksNumber = false) {
    saveTracksDataToLocalStorage(tracksData);

    const trackItems = [];

    for (const [i, trackData] of tracksData.entries()) {
        const track = document.createElement('article');
        track.className = 'track';

        const trackExtraInfo = document.createElement('div');
        trackExtraInfo.className = 'track__extra-info';

        if (trackData.explicit) {
            const explicitTag = document.createElement('span');
            explicitTag.className = 'track__explicit-content';
            explicitTag.innerHTML = 'E';

            trackExtraInfo.append(explicitTag);
        }

        trackExtraInfo.append(...arrayToSpanArray(trackData.artists, ['track__artist']));

        const trackNumberContainer = document.createElement('div');
        trackNumberContainer.className = 'track__number-container';

        const trackCoverContainer = document.createElement('div');
        trackCoverContainer.className = 'track__cover-container';

        const trackPlayButton = document.createElement('svg');
        trackPlayButton.className = 'track__play';
        trackPlayButton.setAttribute('height', '16px');
        trackPlayButton.setAttribute('width', '16px');
        trackPlayButton.innerHTML = `<use xlink:href="imgs/icons/icons.svg#play"></use>`;

        if (includeTracksNumber) {
            const trackNumber = document.createElement('span');
            trackNumber.className = 'track__number';
            trackNumber.innerHTML = i + 1;

            trackNumberContainer.append(trackNumber);
            trackNumberContainer.append(trackPlayButton);
        }

        if (includeTracksCover) {
            const coverURL = trackData.album.images[0].url;

            const trackCover = document.createElement('img');
            trackCover.className = 'track__cover';
            trackCover.setAttribute('alt', 'Обложка');
            trackCover.setAttribute('src', coverURL);

            trackCoverContainer.append(trackCover);

            if (!includeTracksNumber) {
                const trackShadow = document.createElement('div');
                trackShadow.className = 'track__cover_shadow';

                trackCoverContainer.append(trackShadow);
                trackCoverContainer.append(trackPlayButton);
            }
        }

        const durationString = timeToString(trackData.duration_ms, false);

        track.innerHTML = `
            <div class="track__left">
                ${includeTracksNumber ? trackNumberContainer.outerHTML : ''}
                ${includeTracksCover ? trackCoverContainer.outerHTML : ''}
                <div class="track__info">
                    <span class="track__title">${trackData.name}</span>
                </div>
            </div>
            <div class="track__right">
                <svg height="16px" width="16px" class="track__favourite">
                    <use xlink:href="imgs/icons/icons.svg#heart"></use>
                </svg>
                <span class="track__length">${durationString}</span>
                <svg height="16px" width="16px" class="track__other">
                    <use xlink:href="imgs/icons/icons.svg#other"></use>
                </svg>
            </div>
        `;

        const trackInfo = track.children[0].children[track.children[0].children.length - 1];
        trackInfo.append(trackExtraInfo);

        track.addEventListener('click', (event) => {
            if (event.target.classList.contains('link')) {
                return;
            }

            loadTrack(i);
        });

        trackItems.push(track);
    }

    return trackItems;
}

/**
 * Создает html-секцию с треками по заданным параметрам.
 * Секция состоит из определенной шапки и тела.
 * @param {Array<object>} tracksData Массив объектов с данными треков: название(name: string), 
 * данные исполнителей(artists: Array<{ name: string }>), 
 * данные альбома(album: { images: Array<{ url: string, width: number, height: number }> }),
 * продолжительность трека в миллисекундах(duration_ms: number), 18+(explicit: boolean).
 * @param {boolean} includeTracksCover Параметр-флаг добавляет обложку трека.
 * @param {boolean} includeTracksNumber Параметр-флаг добавляет номер трека.
 * @description Возможны любые комбинации includeTracksCover и includeTracksNumber, но в случае false false вернется пустая секция.
 * @returns {HTMLElement} Секция с треками.
 */

export function parseTracks(tracksData, includeTracksCover = true, includeTracksNumber = false) {
    const tracks = document.createElement('section');

    if (!includeTracksCover && !includeTracksNumber) {
        return tracks;
    }

    if (includeTracksCover && !includeTracksNumber) { //searchPage
        tracks.className = 'tracks-search-result';

        const tracksBody = document.createElement('div');
        tracksBody.className = 'tracks-search-result__container';
        tracksBody.append(...parseTrackItems(tracksData, includeTracksCover, includeTracksNumber));

        tracks.append(parseSearcPageTracksHeader());
        tracks.append(tracksBody);
        return tracks;
    }

    if (!includeTracksCover && includeTracksNumber) { //albumPage
        tracks.className = 'album-page__track-list';
        tracks.innerHTML = `<div class="track-list"></div>`;

        tracks.children[0].append(...parseAlbumPageTracksHeader());
        tracks.children[0].append(...parseTrackItems(tracksData, includeTracksCover, includeTracksNumber));
        return tracks;
    }

    tracks.className = 'artist-page__popular-tracks'; //artistPage

    const tracksBody = document.createElement('div');
    tracksBody.className = 'popular-tracks__container';
    tracksBody.append(...parseTrackItems(tracksData, includeTracksCover, includeTracksNumber));

    tracks.append(...parseArtistPageTracksHeader());
    tracks.append(tracksBody);
    return tracks;
}
