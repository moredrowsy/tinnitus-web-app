import React from 'react';
import Track from './Track';
import PlayButton from './PlayButton';

function Mix({
  mix,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const soundsArray = mix.soundIDs.map((soundId) => sounds[soundId]);

  const toggleMixSounds = () => {
    toggleMix({ mixId: mix.id, soundList: soundsArray });
  };

  return (
    <div className='flex flex-col justify-center items-stretch bg-white rounded mb-5 shadow-md'>
      <div className='flex-1 flex justify-center items-center bg-gray-200 text-gray-800 rounded-tl rounded-tr text-center p-1'>
        <div className='flex-none font-semibold'>{mix.votes}</div>
        <div className='flex-1 font-bold'>{mix.title}</div>
        <div className='flex-none'>
          <PlayButton
            noneClassName={'h-6 w-6 text-gray-400'}
            playClassName={'h-6 w-6 text-blue-400'}
            pauseClassName={'h-6 w-6 text-orange-400'}
            downloadingClassName={
              'w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600'
            }
            status={mix.status}
            toggleFn={toggleMixSounds}
          />
        </div>
      </div>

      <div className='flex-1'>
        {soundsArray.map((sound) => (
          <div className='border-b' key={sound.id}>
            <Track sound={sound} toggleSoundFile={toggleSoundFile} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mix;
