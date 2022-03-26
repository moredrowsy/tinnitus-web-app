import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VOLUME } from '../constants';
import { updateUserMixTrackVolumeAsync } from '../store/redux/slices/user';
import PlayButton from './PlayButton';

function Track({
  changeSoundVolume,
  isSelcted,
  mixId,
  sound,
  toggleSelected,
  toggleSoundFile,
  userId,
}) {
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

  //   const sounds = useSelector(selectSounds);
  //   useEffect(() => {
  //     if (sounds.hasOwnProperty(sound.id) && sounds[sound.id].volume !== volume) {
  //       setVolume(sounds[sound.id].volume);
  //     }
  //   }, [sounds, sound.id, volume]);

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);
    changeSoundVolume({
      id: sound.id,
      storageKey: sound.storagePath,
      volume: newVolValue,
    });
    dispatch(
      updateUserMixTrackVolumeAsync({
        userId,
        mixId,
        soundId: sound.id,
        volume: newVolValue,
      })
    );
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
              toggleSoundFile({
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
          className='appearance-none w-full h-1 bg-blue-100 accent-pink-500 rounded'
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
}

export default Track;
