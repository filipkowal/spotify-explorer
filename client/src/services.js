const serverUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888'
    : process.env.REACT_APP_HEROKU
    ? 'http://localhost:5000'
    : 'https://spotify-moodboard.herokuapp.com';
getTokens();

function getUser() {
  return getData('https://api.spotify.com/v1/me');
}
function getLikedTracks() {
  return getData('https://api.spotify.com/v1/me/tracks');
}
function getRecommendedTracks(seeds) {
  const uri =
    'https://api.spotify.com/v1/recommendations?seed_tracks=' +
    seeds.reduce((p, c, i) => (i === 0 ? c.id : p + ',' + c.id), '');
  return getData(uri);
}
function likeTrack(id) {
  const token = localStorage.getItem('accessToken');
  const url =
    `https://api.spotify.com/v1/me/tracks?access_token=${token}&ids=` + id;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ access_token: token }),
  });
}

async function logout() {
  await localStorage.clear();
  window.location.href = `${serverUrl}/login?logout=true`;
}

async function getData(url) {
  const options = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    json: true,
  };

  return fetch(url, options)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status === 401 || response.error?.status === 401) {
          await refresh();
          return getData(url);
        }
        throw response;
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Catched Error:', error);
      return error;
    });
}

async function refresh() {
  await getTokens();
  console.log('refreshing token:' + localStorage.getItem('refreshToken'));
  fetch(
    `${serverUrl}/refresh_token?refresh_token=` +
      localStorage.getItem('refreshToken')
  )
    .then(response => {
      if (!response.ok) {
        if (response.status === 401 || response.error?.status === 401) {
          console.log('Refreshing token failed.');
        }
        throw response;
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('accessToken', data.access_token);
      return data.access_token;
    })
    .catch(error => {
      console.error('Refreshing token error:', error);
    });
}

async function getTokens() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tokens = {
    refresh_token: urlParams.get('refresh_token'),
    access_token: urlParams.get('access_token'),
  };
  const prevAccessToken = localStorage.getItem('accessToken');
  const prevRefreshToken = localStorage.getItem('refreshToken');

  if (
    (tokens.refresh_token === '' || !tokens.refresh_token) &&
    (prevRefreshToken === '' ||
      !prevRefreshToken ||
      prevRefreshToken === 'null')
  ) {
    window.location.href = `${serverUrl}/authorization`;
    return;
  }

  localStorage.setItem('accessToken', tokens.access_token || prevAccessToken);
  localStorage.setItem(
    'refreshToken',
    tokens.refresh_token || prevRefreshToken
  );
}

export {
  getUser,
  getLikedTracks,
  getRecommendedTracks,
  getTokens,
  logout,
  likeTrack,
};
