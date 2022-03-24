import React from 'react';
import Mix from '../../../Mix';

function MixList({
  mixes,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const mixesArray = Object.keys(mixes)
    .map((key) => mixes[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className='mt-5'>
      {mixesArray.map((mix) => (
        <Mix
          key={mix.id}
          mix={mix}
          sounds={sounds}
          toggleMix={toggleMix}
          toggleSoundFile={toggleSoundFile}
          userId={userId}
          usernames={usernames}
          userVotes={userVotes}
        />
      ))}
    </div>
  );
}

export default MixList;
