import React from 'react';
import Sound from '../Sound';

function Sounds({
  soundMetadas,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const soundMetadasArray = Object.keys(soundMetadas)
    .map((key) => soundMetadas[key])
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className='m-5'>
      {soundMetadasArray.map((soundMetadata) => (
        <Sound
          key={soundMetadata.id}
          soundMetadata={soundMetadata}
          toggleSoundFile={toggleSoundFile}
          userId={userId}
          usernames={usernames}
          userVotes={userVotes}
        />
      ))}
    </div>
  );
}

export default Sounds;
