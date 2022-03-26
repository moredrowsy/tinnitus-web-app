import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/mixes';

import Track from './Track';
import Item from './Item';

function Mix({
  changeSoundVolume,
  mix,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
}) {
  const dispatch = useDispatch();
  const userVote = useSelector((state) => {
    if (mix && state.user && state.user.mixes.hasOwnProperty(mix.id)) {
      return state.user.mixes[mix.id].vote;
    }
    return 0;
  });

  if (!mix) return null;

  const soundsArray = mix.soundIDs.map((soundId) => sounds[soundId]);

  const toggleMixSounds = () => {
    toggleMix({ mixId: mix.id, soundList: soundsArray });
  };

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, mixId: mix.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, mixId: mix.id }));
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
      userVote={userVote}
    >
      <div className='border-t'>
        {soundsArray.map((sound) => (
          <div className='border-b' key={sound.id}>
            <Track
              mixId={mix.id}
              changeSoundVolume={changeSoundVolume}
              sound={sound}
              toggleSoundFile={toggleSoundFile}
              userId={userId}
            />
          </div>
        ))}
      </div>
    </Item>
  );
}

export default Mix;
