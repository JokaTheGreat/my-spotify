import { arrayToSpanArray } from "./array.js";
import { timeToString } from "./time.js";

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
 * @param {object} trackData Данные текущего трека: исполнители(artists: Array<String>), 
 * ссылка на обложку(coverURL: string), ссылка на трек(audioPreviewURL: string), название трека(title: string). 
 */

function setPlayer(trackData) {
    const artistContainer = document.createElement('div');
    artistContainer.className = 'current-track__artist-container';
    artistContainer.append(...arrayToSpanArray(trackData.artists, ['current-track__artist']));

    const trackCoverTag = document.getElementsByClassName('current-track__cover')[0];
    trackCoverTag.src = trackData.coverURL;
    trackCoverTag.alt = trackData.title;
    trackCoverTag.hidden = false;

    const trackTitleTag = document.getElementsByClassName('current-track__title')[0];
    trackTitleTag.innerHTML = trackData.title;

    const trackInfoTag = document.getElementsByClassName('current-track__info')[0];
    trackInfoTag.innerHTML = '';
    trackInfoTag.append(trackTitleTag);
    trackInfoTag.append(artistContainer);

    const audioTag = document.getElementsByClassName('current-track__audio')[0];
    audioTag.src = trackData.audioPreviewURL;
}

/**
 * Устанавливает элементы progress-bar:
 * задает в плеере продолжительность трека,
 * обновляет текущее время трека и полоску воспроизведения.
 */

function setProgressBar() {
    const audio = document.getElementsByClassName('current-track__audio')[0];
    const durationTag = document.getElementsByClassName('progress-bar__end')[0];

    const durationString = timeToString(audio.duration * 1000, false);
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

    const setCurrentTimeTask = setInterval(() => setCurrentTime(audio.currentTime), 1000);
    setTimeout(() => clearInterval(setCurrentTimeTask), (audio.duration + 1) * 1000);

    const setCurrentProgressLineTask = setInterval(() => setCurrentProgressLine(audio.currentTime, audio.duration), 50);
    setTimeout(() => clearInterval(setCurrentProgressLineTask), (audio.duration + 1) * 1000);
}

/**
 * Переключает воспроизведение трека. Играющий на паузу. Остановленный запускает.
 */

export function togglePlay() {
    const audioTag = document.getElementsByClassName('current-track__audio')[0];

    if (audioTag.paused) {
        playTrack();
        return;
    }

    pauseTrack();
}

/**
 * Получить индекс текущего трека.
 * @returns {number} Индекс трека. Целое число от 0 до lastTrackId.
 */

function getCurrentTrackId() {
    const audioTag = document.getElementsByClassName('current-track__audio')[0];
    const tracksData = JSON.parse(localStorage.getItem('tracksData'));

    for (const [i, trackItem] of tracksData.entries()) {
        if (audioTag.src === trackItem.audioPreviewURL) {
            return i;
        }
    }
}

/**
 * Получить индекс последнего трека на странице.
 * @returns {number} Индекс трека. Целое число от 0 до lastTrackId.
 */

function getLastTrackId() {
    const tracksData = JSON.parse(localStorage.getItem('tracksData'));

    return tracksData.length - 1;
}

/**
 * Устанавливает текущее время трека.
 * @param {number} offsetX Ненормализованное значение времени(отступ от начала полоски трека). Целое число от 0 до totalWidth=500.
 */

export function setTrackTime(offsetX) {
    const audio = document.getElementsByClassName('current-track__audio')[0];
    if (audio.src === '') {
        return;
    }

    const totalWidth = 500;
    const percentOffset = offsetX / totalWidth;

    audio.currentTime = audio.duration * percentOffset;
}

/**
 * Устанавливает громкость.
 * Устанавливает стили полоски громкости и слайдера громкости.
 * @param {number} offsetX Ненормализованное значение громкости(отступ от начала полоски громкости). Целое число от 0 до totalWidth=94. 
 */

export function setVolume(offsetX) {
    const audio = document.getElementsByClassName('current-track__audio')[0];
    const totalWidth = 94;
    const percentOffset = offsetX / totalWidth;

    audio.volume = percentOffset;

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
    const audioTag = document.getElementsByClassName('current-track__audio')[0];
    const currentTrackId = getCurrentTrackId();

    const audioItems = document.getElementsByClassName('track');
    for (const [i, audioItem] of [...audioItems].entries()) {
        if (i === currentTrackId) {
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

    const audioTag = document.getElementsByClassName('current-track__audio')[0];
    audioTag.pause();
}

/**
 * Загружает следующий трек.
 */

export function nextTrack() {
    const currentTrackId = getCurrentTrackId();
    const lastTrackId = getLastTrackId();
    let newTrackId = currentTrackId + 1;

    if (currentTrackId === lastTrackId) {
        newTrackId = 0;
    }

    loadTrack(newTrackId);
}

/**
 * Загружает предыдущий трек.
 */

export function prevTrack() {
    const currentTrackId = getCurrentTrackId();
    let newTrackId = currentTrackId - 1;

    if (currentTrackId === 0) {
        newTrackId = getLastTrackId();
    }

    loadTrack(newTrackId);
}

/**
 * Загружает трек на страницу: устанавливает настройки плеера, запускает трек после загрузки.
 * @param {number} trackId Индекс трека. Целое число от 0 до lastTrackId.
 */

export function loadTrack(trackId) {
    const audio = document.getElementsByClassName('current-track__audio')[0];
    const tracksData = JSON.parse(localStorage.getItem('tracksData'));

    if (trackId === getCurrentTrackId()) {
        togglePlay(trackId);
        return;
    }

    setPlayer(tracksData[trackId]);
    setPlayerColors();
    audio.onloadedmetadata = () => { 
        setProgressBar();
        playTrack(trackId);
    };
}