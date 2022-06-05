import { parseBestSearchResult } from "./bestSearchResult.js";
import { parseTracks } from "./tracks.js";
import { parseContentItems } from "./contentItems.js";
import { request, REQUESTED_ITEMS_FOR_PAGE_LIMIT } from '../request.js';
import { serverNoDataAlert } from "../alert.js";

/**
 * Получает данные по поисковому запросу на сервер Spotify.
 * @param {string} requestString Строка поискового запроса.
 * @returns {Promise<object>} Полученные данные.
 */

async function getSearchData(requestString) {
  const url = 'https://api.spotify.com/v1/search?q=' + requestString + '&type=artist,track,album' + '&limit=' + REQUESTED_ITEMS_FOR_PAGE_LIMIT;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
}

/**
 * Рендерит страницу поиска по полученным данным.
 * @param {object} data Данные полученные с сервера Spotify: данные треков(tracks: { items: Array<object> }),
 * данные альбомов(albums: { items: Array<object> }), данные исполнителей(artists: { items: Array<object> }).
 */

function setSearchPage(data) {
  const root = document.getElementsByClassName('main')[0].children[1];
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

  if (!searchInput?.value) {
    return;
  }

  const searchPageData = await getSearchData(searchInput.value);

  if (!searchPageData) {
    serverNoDataAlert();
    return;
  }

  setSearchPage(searchPageData);
}