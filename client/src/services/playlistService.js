import { getData } from './authService';

function getLikedTracks() {
  return getData('https://api.spotify.com/v1/me/tracks');
}
function getRecommendedTracks(seeds) {
  const uri =
    'https://api.spotify.com/v1/recommendations?seed_tracks=' +
    seeds.reduce((p, c, i) => (i === 0 ? c.id : p + ',' + c.id), '');
  return getData(uri);
}

export { getLikedTracks, getRecommendedTracks };
