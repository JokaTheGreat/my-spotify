import { Track } from "../../types";
import { MAX_REQUESTED_ITEMS_LIMIT, request } from "../request";

/**
 * Запрашивает данные треков альбома с сервера Spotify.
 * @param {string} albumId Идентификатор альбома на сервере Spotify.
 * @returns {Promise<Track[] | null>} Полученные данные.
 */

export async function getTracksData(albumId: string) {
  const url =
    "https://api.spotify.com/v1/albums/" +
    albumId +
    "/tracks?" +
    "limit=" +
    MAX_REQUESTED_ITEMS_LIMIT;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: { items: Track[] } = await response.json();
  return data?.items;
}
