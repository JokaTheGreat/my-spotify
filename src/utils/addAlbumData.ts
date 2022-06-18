import { Album, Track } from "../types";

/**
 * Добавляет в данные треков альбома данные альбома.
 * @param {Track[]} tracksData Данные треков альбома.
 * @param {Album} albumData Данные альбома.
 * @returns {Track[]} Обновленный массив объектов.
 */

export function addAlbumData(tracksData: Track[], albumData: Album): Track[] {
  return tracksData.map((item) => {
    return { ...item, album: albumData };
  });
}
