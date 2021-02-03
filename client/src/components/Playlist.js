import { pin, pinSolid } from '../assets/icons';

function Playlist({
  playlist,
  toggleTracks,
  pinPlaylist,
  unPinPlaylist,
  isChecked,
  isPinned,
}) {
  return (
    <div key={playlist.id}>
      {playlist.tracks ? (
        <>
          {isPinned(playlist.id) ? (
            <button onClick={() => unPinPlaylist(playlist.id)}>
              <div>{pinSolid} Unpin</div>
            </button>
          ) : (
            <button onClick={() => pinPlaylist(playlist)}>
              <div>{pin} Pin</div>
            </button>
          )}
          <ul>
            {playlist.tracks?.map(track => (
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
        </>
      ) : (
        'Select up to 5 tracks as seeds for recommendations.'
      )}
    </div>
  );
}
export default Playlist;
