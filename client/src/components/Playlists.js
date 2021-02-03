import { useEffect, useState } from 'react';
import uniqueId from 'lodash.uniqueid';
import '../styles/Playlists.css';
import { mongodb } from '../assets/icons';

import { getLikedTracks, getRecommendedTracks } from '../services';
import Playlist from './Playlist';

function Playlists({ setLoadedData }) {
  const [likedTracks, setLikedTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [seedTracks, setSeedtracks] = useState([]);
  const [pinnedPlaylists, setPinnedPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

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
    getRecommendedTracks(seedTracks).then(r => {
      const id = uniqueId();
      setRecommendedTracks({ id: id, tracks: r.tracks } || []);
      if (!currentPlaylist) {
        setCurrentPlaylist(id);
      }
    });
  }, [seedTracks]);

  const [allPlaylists, setAllPlaylists] = useState([]);
  useEffect(() => {
    const playlists = pinnedPlaylists.some(p => p.id === recommendedTracks.id)
      ? pinnedPlaylists
      : [...pinnedPlaylists, recommendedTracks];
    setAllPlaylists(playlists);
  }, [pinnedPlaylists, recommendedTracks]);

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
  function isPinned(id) {
    return pinnedPlaylists.some(p => id === p.id);
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
      {allPlaylists.map(playlist => (
        <Playlist
          key={playlist.id}
          playlist={playlist}
          toggleTracks={toggleTracks}
          pinPlaylist={pinPlaylist}
          unPinPlaylist={unPinPlaylist}
          isChecked={isChecked}
          isPinned={isPinned}
        />
      ))}
    </div>
  );
}

export default Playlists;
