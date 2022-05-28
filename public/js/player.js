import { arrayToSpanArray } from "./array.js";
import { timeToString } from "./time.js";

/**
 * 94px - ширина полоски громкости на странице
 */

export const MAX_AUDIO_VOLUME = 94;

/**
 * Данные текущих треков
 */

let currentTrackData = [];

/**
 * Текущая очередь треков
 */

let currentTrackOrder = [];

/**
 * Id текущего трека из очереди
 */

let currentTrackId = -1;

/**
 * Переменная-указатель на audio tag страницы.
 */
const audioTag = document.getElementsByClassName('current-track__audio')[0];

/**
 * Устанавливает стили кнопок плеера.
 */

function setPlayerColors() {
    const controlButtons = document.getElementsByClassName('controls__btn');
    for (let button of controlButtons) {
        if (button.classList.contains('controls__btn_pause')) {
            const pauseButtonContainer = document.getElementsByClassName('controls__btn-container')[0];
            pauseButtonContainer.classList.add('controls__btn-container_active');
            continue;
        }
        button.classList.add('controls__btn_active');
    }
}

/**
 * Загружает текущий трек в плеер:
 * устанавливает обложку трека,
 * название и его исполнителей,
 * загружает трек по ссылке.
 * @param {number} trackId Id текущего трека.
 */

function setPlayer(trackId) {
    const artistContainer = document.createElement('div');
    artistContainer.className = 'current-track__artist-container';
    artistContainer.append(...arrayToSpanArray(currentTrackData[currentTrackOrder[trackId]].artists, ['current-track__artist']));

    const trackCoverTag = document.getElementsByClassName('current-track__cover')[0];
    trackCoverTag.src = currentTrackData[currentTrackOrder[trackId]].coverURL;
    trackCoverTag.alt = currentTrackData[currentTrackOrder[trackId]].title;
    trackCoverTag.hidden = false;

    const trackTitleTag = document.getElementsByClassName('current-track__title')[0];
    trackTitleTag.innerHTML = currentTrackData[currentTrackOrder[trackId]].title;

    const trackInfoTag = document.getElementsByClassName('current-track__info')[0];
    trackInfoTag.innerHTML = '';
    trackInfoTag.append(trackTitleTag);
    trackInfoTag.append(artistContainer);

    audioTag.src = currentTrackData[currentTrackOrder[trackId]].audioPreviewURL;
}

/**
 * Устанавливает элементы progress-bar:
 * задает в плеере продолжительность трека,
 * обновляет текущее время трека и полоску воспроизведения.
 */

function setProgressBar() {
    const durationTag = document.getElementsByClassName('progress-bar__end')[0];

    const durationString = timeToString(audioTag.duration * 1000, false);
    durationTag.innerHTML = durationString;

    const setCurrentTime = (currentTime) => {
        const currentTimeTag = document.getElementsByClassName('progress-bar__current')[0];
        const currentTimeString = timeToString(currentTime * 1000, false);

        currentTimeTag.innerHTML = currentTimeString;
    };

    const setCurrentProgressLine = (currentTime, totalTime) => {
        const progressLinePercentage = currentTime / totalTime * 100;

        const progressSliderTag = document.getElementsByClassName('progress-bar__slider')[0];
        progressSliderTag.style.left = '' + progressLinePercentage + '%';

        const progressLineTag = document.getElementsByClassName('progress-bar__line')[0];
        progressLineTag.style.width = '' + progressLinePercentage + '%';
    };

    const setCurrentTimeTask = setInterval(() => setCurrentTime(audioTag.currentTime), 1000);
    setTimeout(() => clearInterval(setCurrentTimeTask), (audioTag.duration + 1) * 1000);

    const setCurrentProgressLineTask = setInterval(() => setCurrentProgressLine(audioTag.currentTime, audioTag.duration), 50);
    setTimeout(() => clearInterval(setCurrentProgressLineTask), (audioTag.duration + 1) * 1000);
}

/**
 * Переключает воспроизведение трека. Играющий на паузу. Остановленный запускает.
 */

export function togglePlay() {
    if (audioTag.paused) {
        playTrack();
        return;
    }

    pauseTrack();
}

/**
 * Устанавливает текущее время трека.
 * @param {number} offsetX Ненормализованное значение времени(отступ от начала полоски трека). Целое число от 0 до totalWidth=500.
 */

export function setTrackTime(offsetX) {
    if (audioTag.src === '') {
        return;
    }

    const totalWidth = 500;
    const percentOffset = offsetX / totalWidth;

    audioTag.currentTime = audioTag.duration * percentOffset;
}

/**
 * Устанавливает громкость.
 * Устанавливает стили полоски громкости и слайдера громкости.
 * @param {number} offsetX Ненормализованное значение громкости(отступ от начала полоски громкости). Целое число от 0 до totalWidth=94. 
 */

export function setVolume(offsetX) {
    const percentOffset = offsetX / MAX_AUDIO_VOLUME;

    audioTag.volume = percentOffset;

    const volumeLine = document.getElementsByClassName('side-controls__volume-line')[0];
    volumeLine.style.width = '' + percentOffset * 100 + '%';

    const volumeSlider = document.getElementsByClassName('side-controls__volume-slider')[0];
    volumeSlider.style.left = '' + percentOffset * 100 + '%';
}

/**
 * Добавляет стили играющему треку, удаляет у остальных.
 * Меняет иконку плеера.
 * Запускает трек.
 */

function playTrack() {
    const audioItems = document.getElementsByClassName('track');
    for (const [i, audioItem] of [...audioItems].entries()) {
        if (i === currentTrackOrder[currentTrackId] && isCurrentTrackDataInLocalStorage()) {
            audioItem.classList.add('track_active');
            continue;
        }
        audioItem.classList.remove('track_active');
    }

    const playIcon = document.getElementsByClassName('play-icon')[0];
    const pauseIcon = document.getElementsByClassName('pause-icon')[0];
    playIcon.setAttribute('visibility', 'hidden');
    pauseIcon.setAttribute('visibility', 'visible');

    audioTag.play();
}

/**
 * Убирает стили играющего трека.
 * Меняет иконку плеера.
 * Останавливает трек.
 */

function pauseTrack() {
    const audioItems = document.getElementsByClassName('track');
    for (const audioItem of audioItems) {
        audioItem.classList.remove('track_active');
    }

    const playIcon = document.getElementsByClassName('play-icon')[0];
    const pauseIcon = document.getElementsByClassName('pause-icon')[0];
    playIcon.setAttribute('visibility', 'visible');
    pauseIcon.setAttribute('visibility', 'hidden');

    audioTag.pause();
}

/**
 * Переключает повтор трека.
 */

export function loopTrackToggle() {
    audioTag.toggleAttribute('loop');
}

/**
 * Переменная-флаг случайного порядка треков. 
 * True - порядок треков случайный, false - нет.
 */

let isCurrentTrackOrderRandom = false;

/**
 * Переключает случайный порядок треков.
 */

export function toggleRandomTrackOrder() {
    if (isCurrentTrackOrderRandom) {
        isCurrentTrackOrderRandom = false;
        currentTrackId = currentTrackOrder[currentTrackId];
        currentTrackOrder = Array.from(Array(currentTrackOrder.length).keys());
        return;
    }

    const newTrackOrder = [];
    newTrackOrder.push(currentTrackId);
    currentTrackOrder.splice(currentTrackId, 1);

    let currentIndex = currentTrackOrder.length;

    while (currentIndex) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        newTrackOrder.push(currentTrackOrder[randomIndex]);
        currentTrackOrder.splice(randomIndex, 1);
    }

    currentTrackOrder = [...newTrackOrder];
    currentTrackId = 0;
    isCurrentTrackOrderRandom = true;
}

/**
 * Загружает следующий трек.
 */

export function nextTrack() {
    if (currentTrackId === currentTrackOrder.length - 1) {
        loadTrack(0);
        return;
    }

    loadTrack(currentTrackId + 1);
}

/**
 * Загружает предыдущий трек.
 */

export function prevTrack() {
    if (currentTrackId === 0) {
        loadTrack(currentTrackOrder.length - 1);
        return;
    }

    loadTrack(currentTrackId - 1);
}

/**
 * Загружает трек на страницу: устанавливает настройки плеера, запускает трек после загрузки.
 * @param {number} trackId Индекс трека. Целое число от 0 до lastTrackId.
 */

function loadTrack(trackId) {
    if (trackId === currentTrackId) {
        togglePlay();
        return;
    }

    currentTrackId = trackId;
    setPlayer(trackId);
    setPlayerColors();
    audioTag.onloadedmetadata = () => {
        setProgressBar();
        playTrack();
    };
}

/**
 * Сравнивает текущий набор треков с набором хранящимся в local storage.
 * @returns {boolean} True если это один и тот же набор, false иначе.
 */

function isCurrentTrackDataInLocalStorage() {
    return localStorage.getItem('tracksData') === JSON.stringify(currentTrackData);
}

/**
 * Заменяет очередь треков на новую.
 * Вызывает загрузку трека по идентификатору.
 * @param {number} trackId Идентификатор трека для загрузки. 
 */

export function loadTracksQuery(trackId) {
    if (!isCurrentTrackDataInLocalStorage()) {
        const tracksData = JSON.parse(localStorage.getItem('tracksData'));
        currentTrackData = tracksData;
        currentTrackOrder = Array.from(Array(tracksData.length).keys());
        currentTrackId = -1;
    }
    
    if (isCurrentTrackOrderRandom) {
        toggleRandomTrackOrder();
        loadTrack(trackId);
        toggleRandomTrackOrder();
        return;
    }

    loadTrack(trackId);
}