import { artistPage } from "./components/artistPage.js";

/**
 * Превращает массив объектов в строку значений заданого поля.
 * @param {Array<object>} stringArray Массив объектов.
 * @param {string} field Поле объекта.
 * @returns {string} Строка значений заданого поля разделенная пробелами.
 */

export function arrayToString(stringArray, field) {
    return stringArray.reduce((result, item, i) => {
        result += item[field];
        if (i !== stringArray.length - 1) {
            result += ', ';
        }

        return result;
    }, '');
}

/**
 * Оборачивает каждое имя из массива в тег span и задает eventListener.
 * @param {Array<string> | Array<object>} itemsData Массив имен или объектов с полем name.
 * @param {Array<string>} spanClassList Массив дополнительных классов для span элементов.
 * @returns {Array<HTMLElement>} Массив тегов span с значениями поля name.
 */

export function arrayToSpanArray(itemsData, spanClassList = []) {
    const itemsArray = [];

    let itemsNames;
    if (typeof itemsData[0] === 'string') {
        itemsNames = itemsData;
    }
    else {
        itemsNames = itemsData.map(item => item.name);
    }

    for (const [i, item] of itemsNames.entries()) {
        const itemTag = document.createElement('span');
        itemTag.classList.add('link', ...spanClassList);
        itemTag.innerHTML = item;

        if (i !== itemsNames.length - 1) {
            itemTag.innerHTML += ', ';
        }

        itemTag.addEventListener('click', () => artistPage(itemsData[i].id));

        itemsArray.push(itemTag);
    }

    return itemsArray;
}

/**
 * Фильтрует массив объектов по полю name, оставляя объекты с уникальным значением.
 * @param {Array<object>} itemsArray Массив объектов с полем name.
 * @returns {Array<object>} Массив объектов с уникальным значением name.
 */

export function getUnicElements(itemsArray) {
    const itemNames = itemsArray.map(item => item.name);

    return itemsArray.filter((item, i) => {
        return itemNames.indexOf(item.name) === i;
    });
}