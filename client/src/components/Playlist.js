import { pin, pinSolid } from '../assets/icons';
import { likeTrack } from '../services';

function Playlist({ playlist, toggleTracks, pinPlaylist, isChecked }) {
  return (
    <div key={playlist.id}>
      {playlist.tracks ? (
        <ul>
          {playlist.tracks?.map(track => (
            <li key={track.id} name={track.id}>
              <input
                id={track.id}
                type="checkbox"
                checked={isChecked(track.id)}
                name={track.id}
                onChange={e => {
                  toggleTracks(e);
                  pinPlaylist(playlist);
                }}
              />
              <button onClick={() => likeTrack(track.id)}>Like</button>
              <label for={track.id}>
                {track.artists[0].name} - {track.name}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className="secondary">The results will go here.</p>
      )}
    </div>
  );
}
export default Playlist;
