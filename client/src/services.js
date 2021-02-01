const PORT = process.env.PORT || '8888';
const clientUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://spotify-moodboard.herokuapp.com/'
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
    .then(response => {
      if (!response.ok) {
        if (response.status === 401 || response.error?.status === 401) {
          refresh(() => getData(url));
        }
        throw response;
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      return data;
    })
    .catch(error => {
      console.error('Catched Error:', error);
      return error;
    });
}

async function refresh(callback) {
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
      console.log('Success:', data);
      localStorage.setItem('accessToken', data.access_token);
      callback();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function getTokens() {
  const response = await fetch(`${clientUrl}/tokens`);
  const tokens = await response.json();
  const prevAccessToken = localStorage.getItem('accessToken');
  const prevRefreshToken = localStorage.getItem('refreshToken');
  if (
    tokens.refresh_token === '' &&
    (prevRefreshToken === '' || !prevRefreshToken)
  ) {
    window.location.href = clientUrl;
  }
  localStorage.setItem('accessToken', tokens.access_token || prevAccessToken);
  localStorage.setItem(
    'refreshToken',
    tokens.refresh_token || prevRefreshToken
  );
}

export { getUser, getLikedTracks, getRecommendedTracks, getTokens };
