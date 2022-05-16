import { parseItemCover } from './itemCover.js';
import { albumPage } from './albumPage.js';
import { artistPage } from './artistPage.js';
import { arrayToSpanArray } from '../array.js';

/**
 * Создает секцию с исполнителями или альбомами.
 * @param {Array<object>} contentData Массив данных элементов секции вида: тип(type: album | artist),
 * обложка(images: Array<{ url: string }>), название(name: string), 
 * данные артистов(artists: Array<{ name: string }>)(есть если тип объектов равен album).
 * @param {string} contentTitle Заголовок секции.
 * @returns {HTMLElement} Элемент-секция с исполнителями или альбомами.
 */

export function parseContentItems(contentData, contentTitle) {
  const content = document.createElement('section');
  content.className = 'content-items';

  if (!contentData.length) {
    return content;
  }

  const contentType = contentData[0].type;

  const contentHeader = document.createElement('div');
  contentHeader.className = 'content-items__header';

  const showAllTag = document.createElement('span');
  showAllTag.className = 'content-items__show-all';
  showAllTag.innerHTML = 'Все';

  showAllTag.addEventListener('click', () => { console.log('Все') });

  contentHeader.innerHTML = `
    <h2 class="content-items__title">${contentTitle}</h2>
  `;
  contentHeader.append(showAllTag);

  const contentBody = document.createElement('div');
  contentBody.className = 'content-items__container';

  for (const contentItemData of contentData) {
    const coverURL = contentItemData.images[0] ? contentItemData.images[0].url : null;
    const title = contentItemData.name;

    const contentItem = document.createElement('article');
    contentItem.className = 'content-item';

    const subtitle = document.createElement('span');
    subtitle.className = 'content-item__subtitle';

    if (contentType === 'album') {
      subtitle.append(...arrayToSpanArray(contentItemData.artists));
    }
    else {
      subtitle.innerHTML = 'Исполнитель';
    }

    contentItem.innerHTML = `
      <div class="content-item__inner">
        <div class="content-item__play-button-container">
          <div class="content-item__img-container ${contentType === 'album' ? '' : 'content-item__img-container_round'}">
            ${parseItemCover(coverURL, title).outerHTML}
          </div>
          <div class="play-button">
            <svg class="play-button__svg" height="24px" width="24px">
              <use xlink:href="imgs/icons/icons.svg#play"></use>
            </svg>
          </div>
        </div>
        <h3 class="content-item__name">${title}</h3>
      </div>
    `;

    contentItem.children[0].append(subtitle);

    
    contentItem.addEventListener('click', (event) => {
      if(event.target.className === 'link') {
        return;
      }

      contentType === 'album' ? albumPage(contentItemData) : artistPage(contentItemData.id);
    });

    contentBody.append(contentItem);
  };

  content.append(contentHeader);
  content.append(contentBody);
  return content;
}
