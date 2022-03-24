import React from 'react';
import PlayButton from './PlayButton';

function Track({ isSelcted, sound, toggleSelected, toggleSoundFile }) {
  return (
    <div className={`flex ${isSelcted ? 'bg-sky-400' : 'hover:bg-gray-100'} `}>
      <div
        className='flex-1 text-sm overflow-hidden text-ellipsis p-1'
        onClick={() => toggleSelected(sound.id)}
      >
        {sound.title}
      </div>
      <div className='p-1'>
        <PlayButton
          noneClassName={'h-6 w-6 text-gray-400'}
          playClassName={'h-6 w-6 text-blue-400'}
          pauseClassName={'h-6 w-6 text-orange-400'}
          downloadingClassName={'w-6 h-6 text-gray-800'}
          status={sound.status}
          toggleFn={() =>
            toggleSoundFile({ id: sound.id, storageKey: sound.storagePath })
          }
        />
      </div>
    </div>
  );
}

export default Track;
