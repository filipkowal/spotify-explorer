function NextPrevButtons({
  currentPlaylistIndex,
  allPlaylists,
  displayPreviousPlaylist,
  displayNextPlaylist,
}) {
  return (
    <>
      {currentPlaylistIndex > 0 ? (
        <button className="previous-button" onClick={displayPreviousPlaylist}>
          previous
        </button>
      ) : (
        ''
      )}
      {currentPlaylistIndex + 1 < allPlaylists.length ? (
        <button className="next-button" onClick={displayNextPlaylist}>
          next
        </button>
      ) : (
        ''
      )}
    </>
  );
}

export default NextPrevButtons;
