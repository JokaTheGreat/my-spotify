/**
 * Получает год из даты релиза альбома.
 * @param {string} date Дата релиза альбома вида: yyyy-mm-dd.
 * @returns {string} Год релиза альбома вида: yyyy
 */

export function getYear(date?: string) {
  if (!date) {
    return "";
  }

  return date.substring(0, 4);
}
