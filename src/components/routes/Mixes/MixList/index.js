import React from 'react';
import Mix from '../../../Mix';

function MixList({
  changeSoundVolume,
  mixes,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
}) {
  const mixesArray = Object.keys(mixes)
    .map((key) => mixes[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className='mt-5'>
      {mixesArray.map((mix) => (
        <Mix
          key={mix.id}
          changeSoundVolume={changeSoundVolume}
          mix={mix}
          sounds={sounds}
          toggleMix={toggleMix}
          toggleSoundFile={toggleSoundFile}
          userId={userId}
          usernames={usernames}
        />
      ))}
    </div>
  );
}

export default MixList;
