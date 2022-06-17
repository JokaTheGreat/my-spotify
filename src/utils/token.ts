import { CLIENT_ID, CLIENT_SECRET } from "./properties";

/**
 * Получает токен с сервера Spotify и сохраняет его в local storage.
 * @returns {Promise<number | null>} время жизни токена (в секундах). От 0 до infinity. Обычное значение = 3600.
 */

export async function setToken() {
  const url = "https://accounts.spotify.com/api/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "grant_type=client_credentials" +
      "&client_id=" +
      CLIENT_ID +
      "&client_secret=" +
      CLIENT_SECRET,
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

export async function refreshTokenSetup() {
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
  };

  setTimeout(refreshToken, expiresInMS || defaultRefreshTimeMS);
}
