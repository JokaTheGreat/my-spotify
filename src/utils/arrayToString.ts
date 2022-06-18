import { Artist } from "../types";

/**
 * Превращает массив объектов в строку значений заданого поля.
 * @param {Array<Artist>} stringArray Массив объектов.
 * @param {string} field Поле объекта.
 * @returns {string} Строка значений заданого поля разделенная пробелами.
 */

export function arrayToString(stringArray: Artist[], field: "name" | "id") {
  return stringArray.reduce((result, item, i) => {
    result += field === "id" ? item.id : item.name;
    if (i !== stringArray.length - 1) {
      result += ",";
    }

    return result;
  }, "");
}
