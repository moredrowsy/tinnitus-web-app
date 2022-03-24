import React from 'react';
import AddMix from './AddMix';
import MixList from './MixList';

function Mixes({
  mixes,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  return (
    <div className='m-5'>
      <AddMix
        sounds={sounds}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
      />
      <MixList
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
