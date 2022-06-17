import { Album } from "../types";

/**
 * Фильтрует массив объектов по полю name, оставляя объекты с уникальным значением.
 * @param {Album[]} itemsArray Массив объектов с полем name.
 * @returns {Album[]} Массив объектов с уникальным значением name.
 */

export function getUnicElementsByName(itemsArray: Album[]) {
  const itemNames = itemsArray.map((item) => item.name);

  return itemsArray.filter((item, i) => {
    return itemNames.indexOf(item.name) === i;
  });
}
