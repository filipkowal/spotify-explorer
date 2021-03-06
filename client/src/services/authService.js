const serverUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888'
    : process.env.REACT_APP_HEROKU
    ? 'http://localhost:5000'
    : 'https://spotify-moodboard.herokuapp.com';
const getDataQue = [];

getTokens();

async function getData(url) {
  if (getDataQue.includes(url)) return;
  getDataQue.push(url);

  const options = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') },
    json: true,
  };

  return fetch(url, options)
    .then(async function (response) {
      if (!response.ok) {
        if (response.status === 401 || response.error?.status === 401) {
          const refreshResult = await refresh();
          if (!refreshResult.ok) throw refreshResult;
          getDataQue.pop();
          return getData(url);
        }
        throw response;
      }
      getDataQue.pop();
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
  getTokens();
  const result = await fetch(
    `${serverUrl}/refresh_token?refresh_token=` +
      localStorage.getItem('refreshToken')
  )
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('accessToken', data.access_token);
      return data.access_token;
    })
    .catch(error => {
      return error;
    });

  return result;
}

function getTokens() {
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

export { getData, serverUrl };
