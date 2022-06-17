import { Album } from "../../types/Album";
import { request } from "../request";

/**
 * Запрашивает данные альбома с сервера Spotify.
 * @param {string} albumId Идентификатор альбома на сервере Spotify.
 * @returns {Promise<Album | null>} Полученные данные.
 */

export async function getAlbumData(albumId: string) {
  const url = "https://api.spotify.com/v1/albums/" + albumId;

  const response = await request(url);
  if (!response.ok) {
    return null;
  }

  const data: Album = await response.json();
  return data;
}
