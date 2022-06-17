import { Artist } from "../../types";
import { request, REQUESTED_ITEMS_FOR_PAGE_LIMIT } from "../request";

/**
 * Запрашивает похожих исполнителей с сервера Spotify.
 * @param {string} artistId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<Artist[] | null>} Полученные данные.
 */

export async function getRelatedArtists(artistId: string) {
  const url =
    "https://api.spotify.com/v1/artists/" + artistId + "/related-artists";

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { artists: Artist[] } = await response.json();
  return data?.artists.slice(0, REQUESTED_ITEMS_FOR_PAGE_LIMIT);
}
