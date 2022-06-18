/**
 * Создает объект Image с переданными параметрами.
 * @param {ImageType} coverData Данные картинки: ссылка(url: string), ширина в пикселях(width: number), высота в пикселях(height: number).
 * @returns {HTMLImageElement} Объект Image с переданными параметрами.
 */

import { ImageType } from "../types";

export function createImg(coverData: ImageType) {
  const img = new Image(coverData.width, coverData.height);
  img.crossOrigin = "Anonymous";
  img.src = coverData.url;

  return img;
}
