import React from 'react';
import Sound from '../Sound';

function Sounds({ sounds, toggleSoundFile, userId, usernames, userVotes }) {
  const soundsArray = Object.keys(sounds)
    .map((key) => sounds[key])
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className='m-5'>
      {soundsArray.map((sound) => (
        <Sound
          key={sound.id}
          sound={sound}
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
