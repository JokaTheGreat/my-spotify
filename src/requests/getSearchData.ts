import { SearchResult } from "../types";
import { request, REQUESTED_ITEMS_FOR_PAGE_LIMIT } from "./request";

/**
 * Получает данные по поисковому запросу на сервер Spotify.
 * @param {string} requestString Строка поискового запроса.
 * @returns {Promise<SearchResult | null>} Полученные данные.
 */

export async function getSearchData(requestString: string) {
  const url =
    "https://api.spotify.com/v1/search?q=" +
    requestString +
    "&type=artist,track,album" +
    "&limit=" +
    REQUESTED_ITEMS_FOR_PAGE_LIMIT;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: SearchResult = await response.json();
  return data;
}
