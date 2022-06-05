import { MAX_REQUESTED_ITEMS_LIMIT, request, REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS } from '../request.js';
import { getMiddleColor, createImg } from '../img.js';
import { scrollToTop } from '../scroll.js';
import { timeToString } from '../time.js';
import { getUnicElementsByName, arrayToString } from '../array.js';
import { parseContentItems } from './contentItems.js';
import { parseTracks } from './tracks.js';
import { artistPage } from './artistPage.js';
import { serverNoDataAlert, somethingWentWrongAlert } from '../alert.js';

/**
 * Запрашивает данные исполнителей с сервера Spotify.
 * @param {string} artistsId Строка с идентификаторами артистов на сервере Spotify, разделенными пробелами. 
 * @returns {Promise<Array<object> | null>} Полученные данные.
 */

async function getArtistsData(artistsId) {
  const url = 'https://api.spotify.com/v1/artists?' + 'ids=' + artistsId;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.artists;
}

/**
 * Запрашивает данные треков альбома с сервера Spotify.
 * @param {string} albumId Идентификатор альбома на сервере Spotify.
 * @returns {Promise<Array<object> | null>} Полученные данные.
 */

async function getAlbumTracks(albumId) {
  const url = 'https://api.spotify.com/v1/albums/' + albumId + '/tracks?' + 'limit=' + MAX_REQUESTED_ITEMS_LIMIT;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.items;
}

/**
 * Запрашивает данные других альбомов исполнителя с сервера Spotify.
 * @param {string} artistId Идентификатор одного из артистов на сервере Spotify, выпустившего альбом. 
 * @returns {Promise<Array<object> | null>} Полученные данные.
 */

async function getArtistAlbums(artistId) {
  const url = 'https://api.spotify.com/v1/artists/' + artistId + '/albums?' + 'limit=' + REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data?.items;
}

/**
 * Получает год из даты релиза альбома.
 * @param {string} date Дата релиза альбома вида: yyyy-mm-dd.
 * @returns {string} Год релиза альбома вида: yyyy
 */

function getYear(date) {
  return date.substring(0, 4);
}

/**
 * Добавляет в данные треков альбома обложку альбома.
 * @param {Array<object>} tracksData Данные треков альбома. 
 * @param {string} coverURL Ссылка на обложку альбома. 
 * @returns {Array<object>} Обновленный массив объектов.
 */

function addCoverURL(tracksData, coverURL) {
  return tracksData.map(item => {
    item.album = {
      images: [{ url: coverURL }]
    };

    return item;
  });
}

/**
 * Устанавливает цвет шапки на странице альбома.
 * Цвет - средний цвет обложки альбома.
 * @param {object} coverData Данные обложки альбома. 
 */

function setHeaderColor(coverData) {
  const img = createImg(coverData);

  img.onload = () => {
    const middleColorRGBString = getMiddleColor(img);

    if (middleColorRGBString) {
      document.getElementsByClassName('album-page-header')[0].style.backgroundColor = `rgb(${middleColorRGBString})`;
      document.getElementsByClassName('album-page__track-list')[0].style.backgroundColor = `rgb(${middleColorRGBString})`;
    }
  }
}

/**
 * Рендерит страницу альбома по переданным данным.
 * @param {object} albumData Данные альбома вида: тип альбома(album_type: album | single),
 * дата релиза(release_date: string), данные обложки(images: Array<{ url: string }>),
 * название(name: string).
 * @param {Array<object>} tracksData Данные треков альбома вида: продолжительность в миллисекундах(duration_ms: number).
 * @param {Array<object>} artistsData Данные исполнителей альбома вида: имя(name: string), данные фотографии(images: Array<{ url: string }>).
 * @param {Array<object>} otherAlbumsData Данные других альбомов исполнителя.
 */

function setAlbumPage(albumData, tracksData, artistsData, otherAlbumsData) {
  const root = document.getElementsByClassName('main')[0].children[1];
  root.className = 'album-page';

  const albumPageHeader = document.createElement('section');
  albumPageHeader.className = 'album-page-header';

  const artistInfo = document.createElement('div');
  artistInfo.className = 'album-page-header__all-artists';

  for (const artistData of artistsData) {
    const artistTag = document.createElement('div');
    artistTag.className = 'album-page-header__artist-info';
    artistTag.insertAdjacentHTML('beforeend', `
    <div class="album-page-header__artist-img-container">
      <img src="${artistData.images[0].url}" alt="${artistData.name}" class="album-page-header__artist-img" />
    </div>
    <span class="album-page-header__artist-name">${artistData.name} <b>·</b></span>
  `);

    artistTag.addEventListener('click', () => artistPage(artistData.id));

    artistInfo.append(artistTag);
  }

  const albumType = albumData.album_type === 'album' ? 'Альбом' : tracksData.length === 1 ? 'Сингл' : 'Мини-альбом';

  const releaseYear = getYear(albumData.release_date);

  const albumLengthMS = tracksData.reduce((result, item) => result + item.duration_ms, 0);
  const albumLengthString = timeToString(albumLengthMS);

  albumPageHeader.insertAdjacentHTML('beforeend', `
    <div class="album-page-header__shadow">
    </div>
    <div class="album-page-header__inner">
      <div class="album-page-header__cover-container">
        <img src="${albumData.images[0].url}" alt="Обложка" class="album-page-header__cover" />
      </div>
      <div class="album-page-header__text">
        <h3 class="album-page-header__subtitle">${albumType}</h3>
        <h1 class="album-page-header__title">${albumData.name}</h1>
        <div class="album-page-header__info">
          <div class="album-page-header__album-info">
            <span>${releaseYear} <b>·</b></span>
            <span>${tracksData.length},</span>
            <span class="album-page-header__album-length">${albumLengthString}</span>
          </div>
        </div>
      </div>
    </div>
  `);

  const albumInfo = albumPageHeader.children[1].children[1].children[2];
  albumInfo.prepend(artistInfo);

  root.innerHTML = '';
  root.append(albumPageHeader);

  const albumPageTrackList = parseTracks(tracksData, false, true);

  const trackListFooter = document.createElement('div');
  trackListFooter.className = 'track-list__footer';

  const artistsNames = arrayToString(artistsData, 'name');

  trackListFooter.insertAdjacentHTML('beforeend', `
    <span class="track-list__copyright">© ${releaseYear} ${artistsNames}</span>
    <span class="track-list__phonogram">℗ ${releaseYear} ${artistsNames}</span>
  `);

  const albumPageTrackListInner = albumPageTrackList.children[0];

  albumPageTrackListInner.append(trackListFooter);

  root.append(albumPageTrackList);

  const albumPageOtherAlbums = document.createElement('div');
  albumPageOtherAlbums.className = 'content-items__wrapper';

  const unicAlbumsData = getUnicElementsByName(otherAlbumsData);

  albumPageOtherAlbums.append(parseContentItems(unicAlbumsData, artistsData[0].name + ': другие альбомы'));

  root.append(albumPageOtherAlbums);
  setHeaderColor(albumData.images[1]);
  scrollToTop();
}

/**
 * Запрашивает необходимые для страницы альбома данные.
 * Вызывает рендер страницы альбома.
 * @param {object} albumData Данные альбома вида: данные исполнителей(artists: Array<{ id: string }>),
 * идентификатор альбома на сервере Spotify(id: string), данные обложки(images: Array<{ url: string }>).
 */

export async function albumPage(albumData) {
  if (!albumData?.artists[0]?.id || !albumData?.id || !albumData?.images[0]?.url) {
    somethingWentWrongAlert();
    return;
  }

  const ARTIST_IDS_STRING_REGEX = /^[a-zA-Z0-9]{22}(,[a-zA-Z0-9]{22})*$/;
  const artistIdsString = arrayToString(albumData.artists, 'id');
  if (!artistIdsString.match(ARTIST_IDS_STRING_REGEX)) {
    somethingWentWrongAlert();
    return;
  }

  const artistsData = await getArtistsData(artistIdsString);

  const otherAlbumsData = await getArtistAlbums(albumData.artists[0].id);

  const tracksData = await getAlbumTracks(albumData.id);

  if (!artistsData || !otherAlbumsData || !tracksData) {
    serverNoDataAlert();
    return;
  }

  const tracksDataUpdated = addCoverURL(tracksData, albumData.images[0].url);

  setAlbumPage(albumData, tracksDataUpdated, artistsData, otherAlbumsData);
}
