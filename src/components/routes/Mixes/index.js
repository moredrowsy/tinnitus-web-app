import React from 'react';
import { useSelector } from 'react-redux';
import { selectMixes } from '../../../store/redux/slices/mixes';
import { selectSounds } from '../../../store/redux/slices/sounds';
import AddMix from './AddMix';
import MixList from './MixList';

function Mixes({
  changeSoundVolume,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);
  return (
    <div className='m-5'>
      <AddMix
        changeSoundVolume={changeSoundVolume}
        sounds={sounds}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
      />
      <MixList
        changeSoundVolume={changeSoundVolume}
        mixes={mixes}
        sounds={sounds}
        toggleMix={toggleMix}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
        usernames={usernames}
        userVotes={userVotes}
      />
    </div>
  );
}

export default Mixes;
