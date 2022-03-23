import React from 'react';
import AddMix from './AddMix';

function Mixes({ sounds, toggleSoundFile, userId }) {
  return (
    <div className='m-5'>
      <AddMix
        sounds={sounds}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
      />
    </div>
  );
}

export default Mixes;
