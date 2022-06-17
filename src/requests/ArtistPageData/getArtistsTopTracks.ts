import { Track } from "../../types";
import { request } from "../request";

/**
 * Запрашивает самые популярные треки исполнителя с сервера Spotify.
 * @param {string} artistId Идентификатор исполнителя на сервере Spotify.
 * @returns {Promise<Track[] | null>} Полученные данные.
 */

export async function getArtistsTopTracks(artistId: string) {
  const url =
    "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=ES";

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { tracks: Track[] } = await response.json();
  return data?.tracks;
}
