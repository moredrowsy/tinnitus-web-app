import React, { useEffect, useState } from 'react';

// React Web
import PlayButton from './PlayButton';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { changeMixSoundVolume, toggleSoundFile } from '../store/cache';
import { VOLUME } from '../constants';

const Track = ({ isSelcted, mixId, sound, toggleSelected, userId }) => {
  const trackVolume = useSelector((state) => {
    if (
      sound &&
      mixId &&
      state.user &&
      state.user.mixes.hasOwnProperty(mixId) &&
      state.user.mixes[mixId].mixVolumes.hasOwnProperty(sound.id)
    ) {
      return state.user.mixes[mixId].mixVolumes[sound.id];
    }
    return VOLUME.default;
  });
  const dispatch = useDispatch();
  const [volume, setVolume] = useState(trackVolume);

  // Update default volume to user volume if it exists
  useEffect(() => {
    if (trackVolume !== VOLUME.default) {
      setVolume(trackVolume);
    }
  }, [trackVolume]);

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);
    changeMixSoundVolume({
      dispatch,
      mixId,
      soundId: sound.id,
      storageKey: sound.storagePath,
      userId,
      volume: newVolValue,
    });
  };

  return (
    <div
      className={`flex flex-col ${
        isSelcted ? 'bg-sky-400' : 'hover:bg-gray-100'
      } `}
    >
      <div className='flex'>
        <div
          className='flex-1 text-sm overflow-hidden text-ellipsis p-1'
          onClick={toggleSelected ? () => toggleSelected(sound.id) : null}
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
              toggleSoundFile({
                dispatch,
                id: sound.id,
                storageKey: sound.storagePath,
                volume,
              })
            }
          />
        </div>
      </div>
      <div className='relative flex-1 flex justify-center items-center text-sm uppercase font-bold text-center'>
        <input
          className='appearance-none transition-opacity duration-300 opacity-50 hover:opacity-100 w-full h-1 bg-blue-400 md:bg-blue-100 accent-pink-500 rounded'
          type='range'
          min={VOLUME.min}
          step={VOLUME.step}
          max={VOLUME.max}
          value={volume}
          onChange={(ev) => onVolChange(Number(ev.target.value))}
        />
      </div>
    </div>
  );
};

export default Track;
