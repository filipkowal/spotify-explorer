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
          <div>previous</div>
        </button>
      ) : (
        ''
      )}
      {currentPlaylistIndex + 1 < allPlaylists.length ? (
        <button className="next-button" onClick={displayNextPlaylist}>
          <div>next</div>
        </button>
      ) : (
        ''
      )}
    </>
  );
}

export default NextPrevButtons;
