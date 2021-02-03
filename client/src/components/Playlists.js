import { useEffect, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import '../styles/Playlists.css';
import { mongodb, pin } from '../assets/icons';

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
    <div className="playlists">
      <p className="secondary">
        {mongodb}Seeds: {5 - seedTracks.length}
      </p>
      <h2>Liked tracks</h2>
      <ul>
        {likedTracks && likedTracks.length
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
      <h2>Recommended tracks</h2>
      {pinnedPlaylists.length
        ? pinnedPlaylists.map(pinnedPlaylist => (
            <>
              <button onClick={() => unPinPlaylist(pinnedPlaylist.id)}>
                <div>{pin} Unpin</div>
              </button>
              <div key={pinnedPlaylist.id}>
                <Playlist
                  playlist={pinnedPlaylist}
                  toggleTracks={toggleTracks}
                  pinPlaylist={pinPlaylist}
                  isChecked={isChecked}
                />
              </div>
            </>
          ))
        : ''}
      <>
        {recommendedTracks.tracks?.length ? (
          <>
            <button onClick={() => pinPlaylist(recommendedTracks)}>
              <div>{pin} Pin</div>
            </button>
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
      </>
    </div>
  );
}

export default Playlists;
