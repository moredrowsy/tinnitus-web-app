import React from 'react';
import { useDispatch } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/sounds';

import Track from './Track';
import Item from './Item';

function Mix({
  mix,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const dispatch = useDispatch();

  if (!mix) return null;

  const soundsArray = mix.soundIDs.map((soundId) => sounds[soundId]);

  const toggleMixSounds = () => {
    toggleMix({ mixId: mix.id, soundList: soundsArray });
  };

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, postId: mix.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, postId: mix.id }));
  };

  return (
    <Item
      commentLink={`/mixes/${mix.id}`}
      decrementVote={decrementVote}
      incrementVote={incrementVote}
      item={mix}
      toggleFn={toggleMixSounds}
      userId={userId}
      usernames={usernames}
      userVotes={userVotes}
    >
      <div className='border-t'>
        {soundsArray.map((sound) => (
          <div className='border-b' key={sound.id}>
            <Track sound={sound} toggleSoundFile={toggleSoundFile} />
          </div>
        ))}
      </div>
    </Item>
  );
}

export default Mix;
