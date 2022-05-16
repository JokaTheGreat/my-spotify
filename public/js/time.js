/**
 * Превращает время в строку нужного вида.
 * @param {number} timeMS Время в миллисекундах.
 * @param {boolean} withWords Параметр-флаг определяет вид возвращаемой строки. 
 * @returns {string} Время в строке (mm:ss / mm мин. ss сек.).
 */

export function timeToString(timeMS, withWords = true) {
    const timeM = Math.floor(timeMS / 1000 / 60);
    const timeS = Math.floor(timeMS / 1000 % 60);
    if (withWords) {
        const timeString = '' + timeM + ' мин. ' + (timeS < 10 ? '0' + timeS : timeS) + ' сек.';
        return timeString;
    }

    const timeString = '' + timeM + ':' + (timeS < 10 ? '0' + timeS : timeS);
    return timeString;
}