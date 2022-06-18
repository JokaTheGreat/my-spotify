import { Artist } from "../../types";
import { request } from "../request";

/**
 * Запрашивает данные исполнителей с сервера Spotify.
 * @param {string} artistsId Строка с идентификаторами артистов на сервере Spotify, разделенными пробелами.
 * @returns {Promise<Artist[] | null>} Полученные данные.
 */

export async function getArtistsData(artistsId: string) {
  const url = "https://api.spotify.com/v1/artists?" + "ids=" + artistsId;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { artists: Artist[] } = await response.json();
  return data?.artists;
}
