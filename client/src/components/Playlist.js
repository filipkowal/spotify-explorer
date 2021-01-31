function Playlist({ playlist, toggleTracks, pinPlaylist, isChecked }) {
  return (
    <ul key={playlist.id}>
      {playlist.tracks.map(track => (
        <li key={track.id} name={track.id}>
          <input
            type="checkbox"
            checked={isChecked(track.id)}
            name={track.id}
            onChange={e => {
              toggleTracks(e);
              pinPlaylist(playlist);
            }}
          />
          {track.artists[0].name} - {track.name}
        </li>
      ))}
    </ul>
  );
}
export default Playlist;
