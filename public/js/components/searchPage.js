import { parseBestSearchResult } from "./bestSearchResult.js";
import { parseTracks } from "./tracks.js";
import { parseContentItems } from "./contentItems.js";
import { request } from '../request.js';

/**
 * Получает данные по поисковому запросу на сервер Spotify.
 * @param {string} requestString Строка поискового запроса.
 * @returns {Promise<object>} Полученные данные.
 */

async function getSearchData(requestString) {
  const url = 'https://api.spotify.com/v1/search?q=' + requestString + '&type=artist,track,album' + '&limit=6';

  const response = await request(url);
  const data = await response.json();

  return data;
}

/**
 * Рендерит страницу поиска по полученным данным.
 * @param {object} data Данные полученные с сервера Spotify: данные треков(tracks: { items: Array<object> }),
 * данные альбомов(albums: { items: Array<object> }), данные исполнителей(artists: { items: Array<object> }).
 */

function setSearchPage(data) {
  const root = document.getElementsByClassName('content')[0] ||
    document.getElementsByClassName('search-result')[0] ||
    document.getElementsByClassName('album-page')[0] ||
    document.getElementsByClassName('artist-page')[0];
  root.className = 'search-result';

  root.innerHTML = '';
  root.append(parseBestSearchResult(data));
  root.append(parseTracks((data.tracks.items).slice(0, 4), true));
  root.append(parseContentItems(data.albums.items, 'Альбомы'));
  root.append(parseContentItems(data.artists.items, 'Исполнители'));
  document.getElementsByClassName('main')[0].scroll({ top: 0, behavior: "smooth" });
}

/**
 * Запрашивает данные по поисковому запросу с сервера Spotify.
 * Вызывает рендер страницы поиска. 
 */

export async function search() {
  const searchInput = document.getElementsByClassName('search-form__input')[0];

  if (searchInput.value === '') {
    return;
  }

  setSearchPage(await getSearchData(searchInput.value));
}