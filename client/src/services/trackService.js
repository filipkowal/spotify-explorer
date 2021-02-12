function likeTrack(id) {
  const token = localStorage.getItem('accessToken');
  const url =
    `https://api.spotify.com/v1/me/tracks?access_token=${token}&ids=` + id;
  return fetch(url, {
    method: 'PUT',
  });
}
function dislikeTrack(id) {
  const token = localStorage.getItem('accessToken');
  const url =
    `https://api.spotify.com/v1/me/tracks?access_token=${token}&ids=` + id;
  return fetch(url, {
    method: 'DELETE',
  });
}
async function checkLikedTrack(id) {
  const token = localStorage.getItem('accessToken');
  const url =
    `https://api.spotify.com/v1/me/tracks/contains?access_token=${token}&ids=` +
    id;
  const isLiked = await fetch(url).then(r => r.json());
  return isLiked;
}

export { likeTrack, dislikeTrack, checkLikedTrack };
