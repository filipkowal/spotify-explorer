const PORT = process.env.PORT || process.env.LOCAL_HEROKU ? '5000' : '8888';
const clientUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://spotify-moodboard.herokuapp.com'
    : `http://localhost:${PORT}`;
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
    `${clientUrl}/refresh_token?refresh_token=` +
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
    window.location.href = `${clientUrl}/authorization`;
    return;
  }

  localStorage.setItem('accessToken', tokens.access_token || prevAccessToken);
  localStorage.setItem(
    'refreshToken',
    tokens.refresh_token || prevRefreshToken
  );
}

export { getUser, getLikedTracks, getRecommendedTracks, getTokens };
