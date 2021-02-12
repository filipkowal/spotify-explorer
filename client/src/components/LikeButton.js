import { heart, heartSolid } from '../assets/icons';
import {
  likeTrack,
  dislikeTrack,
  checkLikedTrack,
} from '../services/trackService';
import { useState, useEffect } from 'react';

function LikeButton({ id }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    checkLikedTrack(id).then(r => setLiked(r[0]));
  }, [id]);

  function toggleLike() {
    if (liked) {
      dislikeTrack(id);
      setLiked(false);
    } else {
      likeTrack(id);
      setLiked(true);
    }
  }
  return (
    <span className="likeButton" onClick={toggleLike}>
      {'  '} {liked ? heartSolid : heart}
    </span>
  );
}

export default LikeButton;
