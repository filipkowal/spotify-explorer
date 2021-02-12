import { getData, serverUrl } from './authService';

function getUser() {
  return getData('https://api.spotify.com/v1/me');
}

async function logout() {
  await localStorage.clear();
  window.location.href = `${serverUrl}/login?logout=true`;
}

export { getUser, logout };
