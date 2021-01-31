import { useEffect, useState } from 'react';
import uniqueId from 'lodash.uniqueid';

import { getLikedTracks, getRecommendedTracks } from '../services';
import Playlist from './Playlist';

function Playlists({ loadedData, setLoadedData }) {
  const [likedTracks, setLikedTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [seedTracks, setSeedtracks] = useState([]);
  const [pinnedPlaylists, setPinnedPlaylists] = useState([]);

  useEffect(() => {
    setLoadedData(prevState => [...prevState, { likedTracks: false }]);
    getLikedTracks()
      .then(r => setLikedTracks(r.items))
      .then(() => {
        setLoadedData(prevState => [...prevState, { likedTracks: true }]);
      });
  }, []);

  useEffect(() => {
    if (seedTracks.length === 0) return;
    getRecommendedTracks(seedTracks).then(r =>
      setRecommendedTracks({ id: uniqueId(), tracks: r.tracks } || [])
    );
  }, [seedTracks]);

  function toggleTracks(e) {
    if (seedTracks.length >= 5 && e.target.checked) return;
    if (seedTracks.some(track => track.id === e.target.name)) {
      setSeedtracks(seedTracks.filter(track => track.id !== e.target.name));
      return;
    }
    const pinnedTracks = pinnedPlaylists.reduce(
      (p, c) => [...p, ...c.tracks],
      []
    );
    const recommended = recommendedTracks.tracks
      ? recommendedTracks.tracks.filter(track => track.id === e.target.name)
      : [];
    setSeedtracks([
      ...seedTracks,
      ...likedTracks
        .filter(track => track.track.id === e.target.name)
        .map(track => track.track),
      ...pinnedTracks.filter(track => track.id === e.target.name),
      ...recommended,
    ]);
  }

  function isChecked(id) {
    return seedTracks.some(seed => seed.id === id);
  }

  function pinPlaylist(playlist) {
    if (pinnedPlaylists.some(pinned => pinned.id === playlist.id)) return;
    setPinnedPlaylists([...pinnedPlaylists, playlist]);
  }
  function unPinPlaylist(id) {
    setPinnedPlaylists(pinnedPlaylists.filter(pinned => pinned.id !== id));
  }

  return (
    <>
      <p>Seeds: {5 - seedTracks.length}</p>
      <p>Liked tracks</p>
      <ul>
        {likedTracks.length
          ? likedTracks.map(track => (
              <li key={track.track.id}>
                <input
                  type="checkbox"
                  checked={isChecked(track.track.id)}
                  name={track.track.id}
                  onChange={toggleTracks}
                />
                {track.track.artists[0].name} - {track.track.name}
              </li>
            ))
          : 'Loading liked tracks...'}
      </ul>
      <p>Recommended tracks</p>
      {pinnedPlaylists.length
        ? pinnedPlaylists.map(pinnedPlaylist => (
            <ul key={pinnedPlaylist.id}>
              <button onClick={() => unPinPlaylist(pinnedPlaylist.id)}>
                Unpin
              </button>
              <Playlist
                playlist={pinnedPlaylist}
                toggleTracks={toggleTracks}
                pinPlaylist={pinPlaylist}
                isChecked={isChecked}
              />
            </ul>
          ))
        : ''}
      <ul>
        {recommendedTracks.tracks?.length ? (
          <>
            <button onClick={() => pinPlaylist(recommendedTracks)}>Pin</button>
            <Playlist
              playlist={recommendedTracks}
              toggleTracks={toggleTracks}
              pinPlaylist={pinPlaylist}
              isChecked={isChecked}
            />
          </>
        ) : (
          'Select up to 5 tracks as seeds for recommendations.'
        )}
      </ul>
    </>
  );
}

export default Playlists;
