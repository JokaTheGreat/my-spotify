import { Artist } from "../../types";
import { request } from "../request";

/**
 * Запрашивает данные исполнителя с сервера Spotify.
 * @param {string} artistId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<Artist | null>} Полученные данные.
 */

export async function getArtistData(artistId: string) {
  const url = "https://api.spotify.com/v1/artists/" + artistId;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: Artist = await response.json();
  return data;
}
