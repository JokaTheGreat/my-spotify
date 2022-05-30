import { CLIENT_ID, CLIENT_SECRET } from './properties.js';
import { search } from './components/searchPage.js';
import { nextTrack, prevTrack, togglePlay, setTrackTime, setVolume, MAX_AUDIO_VOLUME, loopTrackToggle, toggleRandomTrackOrder } from './player.js';
import { somethingWentWrongAlert } from './alert.js';

/**
 * Получает токен с сервера Spotify и сохраняет его в localStorage.
 * @returns {Promise<number | null>} время жизни токена (в секундах). От 0 до infinity. Обычное значение = 3600.
 */

async function setToken() {
  const url = 'https://accounts.spotify.com/api/token';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: ('grant_type=client_credentials' +
      '&client_id=' + CLIENT_ID +
      '&client_secret=' + CLIENT_SECRET),
  });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  localStorage.setItem('token', data.access_token);

  return data?.expires_in;
}

/**
 * Автоматически обновляет токен.
 */

async function refreshTokenSetup() {
  const defaultRefreshTimeMS = (3600 - 5 * 60) * 1000; //55 minutes
  const tokenRefreshTime = await setToken();
  if (!tokenRefreshTime) {
    return null;
  }
  const expiresInMS = tokenRefreshTime * 1000;

  const refreshToken = async () => {
    const tokenRefreshTime = await setToken();
    if (!tokenRefreshTime) {
      return null;
    }
    const expiresInMS = tokenRefreshTime * 1000;
    setTimeout(refreshToken, expiresInMS || defaultRefreshTimeMS);
  }

  setTimeout(refreshToken, expiresInMS || defaultRefreshTimeMS);
}

/**
 * Добавляет функциональность поисковых элементов.
 * Добавляет listener'ы для кнопки очистки поля поиска, кнопки поиска, 
 * клавиши enter, поля поиска.
 */

function addSearchFunctionality() {
  const searchButton = document.getElementsByClassName('search-form__button')[0];
  const searchInput = document.getElementsByClassName('search-form__input')[0];
  const clearButton = document.getElementsByClassName('search-form__clear-icon')[0];

  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    clearButton.classList.remove('search-form__clear-icon_active');
  });

  searchButton.addEventListener('click', () => search());
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });

  searchInput.addEventListener('input', (event) => {
    if (event.currentTarget.value !== '') {
      clearButton.classList.add('search-form__clear-icon_active');
    }
    else {
      clearButton.classList.remove('search-form__clear-icon_active');
    }
  });
}

/**
 * Добавляет функциональность элементов плеера.
 * Добавляет listener'ы для конца трека, кнопок play, следующая песня, предыдущая песня,
 * громкости, полосок громкости и времени трека.
 */

function addPlayerFunctionality() {
  const audio = document.getElementsByClassName('current-track__audio')[0];

  const normalTracksOrder = () => {
    nextTrack();
  };

  audio.addEventListener('ended', normalTracksOrder);

  const playButton = document.getElementsByClassName('controls__btn-container')[0];
  playButton.addEventListener('click', () => {
    togglePlay();
  });

  const prevButton = document.getElementsByClassName('prev-button')[0];
  prevButton.addEventListener('click', () => {
    prevTrack();
  });

  const nextButton = document.getElementsByClassName('next-button')[0];
  nextButton.addEventListener('click', () => {
    nextTrack();
  });

  const progressBar = document.getElementsByClassName('progress-bar__main')[0];
  progressBar.addEventListener('click', (event) => {
    setTrackTime(event.offsetX);
  });

  const volumeBar = document.getElementsByClassName('side-controls__volume-bar')[0];
  volumeBar.addEventListener('click', (event) => {
    setVolume(event.offsetX);
  });

  const volumeButton = document.getElementsByClassName('volume-btn')[0];
  volumeButton.addEventListener('click', () => {
    if (audio.volume !== 0) {
      setVolume(0);
    }
    else {
      setVolume(MAX_AUDIO_VOLUME);
    }
  });

  const repeatButton = document.getElementsByClassName('repeat-button')[0];
  repeatButton.addEventListener('click', () => {
    if (!repeatButton.classList.contains('controls__btn_active')) {
      return;
    }

    if (repeatButton.classList.contains('repeat-button_active')) {
      audio.addEventListener('ended', normalTracksOrder);
    }
    else {
      audio.removeEventListener('ended', normalTracksOrder);
    }

    loopTrackToggle();
    repeatButton.classList.toggle('repeat-button_active');
  });

  const mixButton = document.getElementsByClassName('mix-button')[0];
  mixButton.addEventListener('click', () => {
    if (!mixButton.classList.contains('controls__btn_active')) {
      return;
    }

    toggleRandomTrackOrder();
    mixButton.classList.toggle('mix-button_active');
  });

  const queryTracks = document.getElementsByClassName('menu__tracks-query')[0];
  const queryButton = document.getElementsByClassName('query-button')[0];
  queryButton.addEventListener('click', () => {
    queryButton.classList.toggle('query-button_active');
    queryTracks.classList.toggle('menu__tracks-query_hidden');
  });
}

/**
 * Запускает функцию обновления токена.
 * Добавляет базовую функциональность.
 */

async function launchApp() {
  if (await refreshTokenSetup() === null) {
    somethingWentWrongAlert();
    return;
  }

  addSearchFunctionality();
  addPlayerFunctionality();
}

launchApp();
