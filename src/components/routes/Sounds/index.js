import React from 'react';
import Sound from '../Sound';

function Sounds({ soundMetadas, toggleSoundFile }) {
  const soundMetadasArray = Object.keys(soundMetadas)
    .map((key) => soundMetadas[key])
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className='w-full'>
      {soundMetadasArray.map((soundMetadata) => (
        <Sound
          key={soundMetadata.id}
          soundMetadata={soundMetadata}
          toggleSoundFile={toggleSoundFile}
        />
      ))}
    </div>
  );
}

export default Sounds;
