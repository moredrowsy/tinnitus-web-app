import React from 'react';
import { useDispatch } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/sounds';

import Item from './Item';

function Sound({ sound, toggleSoundFile, userId, usernames, userVotes }) {
  const dispatch = useDispatch();

  // Exit if no sound
  if (!sound) return null;

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, postId: sound.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, postId: sound.id }));
  };

  const toggleSound = () => {
    toggleSoundFile({ id: sound.id, storageKey: sound.storagePath });
  };

  return (
    <Item
      commentLink={`/sounds/${sound.id}`}
      decrementVote={decrementVote}
      incrementVote={incrementVote}
      item={sound}
      toggleFn={toggleSound}
      userId={userId}
      usernames={usernames}
      userVotes={userVotes}
    />
  );
}

export default Sound;
