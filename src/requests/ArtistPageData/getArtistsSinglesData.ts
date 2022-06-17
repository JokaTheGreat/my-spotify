import { Album } from "../../types";
import {
  request,
  REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS,
} from "../request";

/**
 * Запрашивает синглы и мини-альбомы исполнителя с сервера Spotify.
 * @param {string} artistId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<Album[] | null>} Полученные данные.
 */

export async function getArtistsSingles(artistId: string) {
  const url =
    "https://api.spotify.com/v1/artists/" +
    artistId +
    "/albums?" +
    "include_groups=single&" +
    "limit=" +
    REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { items: Album[] } = await response.json();
  return data?.items;
}
