import { parseTracks } from './tracks.js';
import { request } from '../request.js';
import { scrollToTop } from '../scroll.js';
import { getUnicElements } from '../array.js';
import { parseContentItems } from './contentItems.js';
import { getMiddleColor, createImg } from '../img.js';

/**
 * Запрашивает данные исполнителя с сервера Spotify.
 * @param {string} aristId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<object>} Полученные данные.
 */

async function getArtistData(artistId) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId;

    const response = await request(url);
    const data = await response.json();

    return data;
}

/**
 * Запрашивает самые популярные треки исполнителя с сервера Spotify.
 * @param {string} aristId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<object>} Полученные данные.
 */

async function getArtistsTopTracks(artistId) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?market=ES';

    const response = await request(url);
    const data = await response.json();

    return data;
}

/**
 * Запрашивает альбомы исполнителя с сервера Spotify.
 * @param {string} aristId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<object>} Полученные данные.
 */

async function getArtistsAlbums(artistId) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums?' + 'include_groups=album&' + 'limit=12';

    const response = await request(url);
    const data = await response.json();

    return data;
}

/**
 * Запрашивает синглы и мини-альбомы исполнителя с сервера Spotify.
 * @param {string} aristId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<object>} Полученные данные.
 */

async function getArtistsSingles(artistId) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums?' + 'include_groups=single&' + 'limit=12';

    const response = await request(url);
    const data = await response.json();

    return data;
}

/**
 * Запрашивает похожих исполнителей с сервера Spotify.
 * @param {string} aristId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<object>} Полученные данные.
 */

async function getRelatedArtists(artistId) {
    const url = 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists';

    const response = await request(url);
    const data = await response.json();

    return data;
}

/**
 * Устанавливает цвет шапки на странице исполнителя.
 * Цвет - средний цвет фотографии исполнителя.
 * @param {object} coverData Данные фотографии исполнителя. 
 */

function setHeaderColor(coverData) {
    const img = createImg(coverData);

    img.onload = () => {
        const middleColorRGBString = getMiddleColor(img);

        if (middleColorRGBString) {
            document.getElementsByClassName('artist-page__header')[0].style.backgroundColor = `rgb(${middleColorRGBString})`;
            document.getElementsByClassName('artist-page__popular-tracks')[0].style.backgroundColor = `rgb(${middleColorRGBString})`;
        }
    }
}

/**
 * Рендерит страницу исполнителя по переданным данным.
 * @param {object} artistData Данные исполнителя вида: имя(name: string), данные подписчиков(followers: { total: number }),
 * данные фотографий(images: Array<{ url: string, width: number, height: number }>).
 * @param {Array<object>} topTracksData Данные самых популярных треков исполнителя.
 * @param {Array<object>} albumsData Данные альбомов исполнителя.
 * @param {Array<object>} singlesData Данные синглов и мини-альбомов исполнителя.
 * @param {Array<object>} relatedArtistsData Данные похожих исполнителей.
 */

function setArtistPage(artistData, topTracksData, albumsData, singlesData, relatedArtistsData) {
    const root = document.getElementsByClassName('content')[0] ||
        document.getElementsByClassName('search-result')[0] ||
        document.getElementsByClassName('album-page')[0] ||
        document.getElementsByClassName('artist-page')[0];
    root.className = 'artist-page';

    const artistPageHeader = document.createElement('section');
    artistPageHeader.className = 'artist-page__header';
    artistPageHeader.innerHTML = `
        <div class="artist-page__photo-wrapper">
            <img class="artist-page__photo" src="${artistData.images[0].url}" alt="${artistData.name}" />
        </div>
        <div class="artist-page__info">
            <div class="upprove-sign">
                <svg height="24px" width="24px" class="upprove-sign__icon">
                    <use xlink:href="imgs/icons/icons.svg#upprove"></use>
                </svg>
                <span class="upprove-sign__title">Подтвержденный исполнитель</span>
            </div>
            <h1 class="artist-page__name">${artistData.name}</h1>
            <div class="artist-page__listeners">${artistData.followers.total} подписчиков</div>
        </div>
    `;

    root.innerHTML = '';
    root.append(artistPageHeader);
    root.append(parseTracks(topTracksData, true, true));

    const unicAlbumsData = getUnicElements(albumsData);

    const artistAlbums = document.createElement('div');
    artistAlbums.className = 'content-items__wrapper';
    artistAlbums.append(parseContentItems(unicAlbumsData, 'Альбомы'));

    root.append(artistAlbums);

    const unicSinglesData = getUnicElements(singlesData);

    const artistsSingles = document.createElement('div');
    artistsSingles.className = 'content-items__wrapper';
    artistsSingles.append(parseContentItems(unicSinglesData, 'Синглы и EP'));

    root.append(artistsSingles);

    const relatedArtists = document.createElement('div');
    relatedArtists.className = 'content-items__wrapper';
    relatedArtists.append(parseContentItems(relatedArtistsData, 'Поклонникам также нравится'));

    root.append(relatedArtists);

    setHeaderColor(artistData.images[1]);
    scrollToTop();
}

/**
 * Запрашивает необходимые для страницы исполнителя данные.
 * Вызывает рендер страницы исполнителя.
 * @param {string} aristId Идентификатор артиста на сервере Spotify.
 */

export async function artistPage(aristId) {
    const artistData = getArtistData(aristId);
    const topTracksData = getArtistsTopTracks(aristId);
    const albumsData = getArtistsAlbums(aristId);
    const singlesData = getArtistsSingles(aristId);
    const relatedArtistsData = getRelatedArtists(aristId);

    setArtistPage(await artistData, (await topTracksData).tracks, (await albumsData).items, (await singlesData).items, (await relatedArtistsData).artists.slice(0, 6));
}