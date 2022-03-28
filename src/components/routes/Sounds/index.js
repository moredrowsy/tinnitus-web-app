import React from 'react';

// React Web
import Sound from '../../Sound';

// Redux
import { useSelector } from 'react-redux';
import { selectSounds } from '../../../store/redux/slices/sounds';

function Sounds({ changeSoundVolume, toggleSoundFile, userId, usernames }) {
  const sounds = useSelector(selectSounds);
  const soundsArray = Object.keys(sounds)
    .map((key) => sounds[key])
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className='m-5'>
      {soundsArray.map((sound) => (
        <Sound
          key={sound.id}
          changeSoundVolume={changeSoundVolume}
          sound={sound}
          toggleSoundFile={toggleSoundFile}
          userId={userId}
          usernames={usernames}
        />
      ))}
    </div>
  );
}

export default Sounds;
