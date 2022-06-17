/**
 * Вычисляет средний цвет картинки по определенному алгоритму(фильтрация черного и белого цветов).
 * @param {HTMLImageElement} img Объект Image с загруженными данными(эту функцию стоит вызывать только в Image.onload).
 * @returns {string | null} Средний цвет картинки в виде rgb строки. Либо null если на картинке оказалось много черных или белых цветов.
 */

export function getMiddleColor(img: HTMLImageElement) {
  const context = document.createElement("canvas").getContext("2d");
  context?.drawImage(img, 0, 0);

  const imageData = context?.getImageData(0, 0, img.width, img.height);
  const data = imageData?.data;
  if (!data) {
    return null;
  }

  let pixelCounter = 0;
  let finalR = 0;
  let finalG = 0;
  let finalB = 0;

  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    const g = data[++i];
    const b = data[++i];
    const a = data[++i];

    if (a === 0) {
      continue;
    }
    if (r < 30 && g < 30 && b < 30) {
      continue;
    }
    if (r > 225 && g > 225 && b > 225) {
      continue;
    }

    finalR += r;
    finalG += g;
    finalB += b;
    pixelCounter++;
  }

  finalR = Math.round(finalR / pixelCounter);
  finalG = Math.round(finalG / pixelCounter);
  finalB = Math.round(finalB / pixelCounter);

  const finalRGBString = "rgb(" + finalR + ", " + finalG + ", " + finalB + ")";

  if (pixelCounter) {
    return finalRGBString;
  }

  return null;
}
