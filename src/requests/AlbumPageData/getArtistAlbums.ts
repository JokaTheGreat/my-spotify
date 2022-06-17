import { Album } from "../../types";
import {
  request,
  REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS,
} from "../request";

/**
 * Запрашивает данные других альбомов исполнителя с сервера Spotify.
 * @param {string} artistId Идентификатор одного из артистов на сервере Spotify, выпустившего альбом.
 * @returns {Promise<Album[] | null>} Полученные данные.
 */

export async function getArtistAlbums(artistId: string) {
  const url =
    "https://api.spotify.com/v1/artists/" +
    artistId +
    "/albums?" +
    "limit=" +
    REQUESTED_ITEMS_FOR_PAGE_LIMIT_WITH_DUBLICATS;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { items: Album[] } = await response.json();
  return data?.items;
}
