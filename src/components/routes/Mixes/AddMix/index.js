import React, { useState } from 'react';
import {
  ArrowCircleRightIcon,
  ArrowCircleLeftIcon,
} from '@heroicons/react/outline';
import Track from '../../../Track';
import { mixLimit } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { addMixAsync } from '../../../../store/redux/slices/mixes';

function AddMix({ sounds, toggleSoundFile, userId }) {
  const dispatch = useDispatch();
  const [selectedSounds, setSelectedSounds] = useState(new Set());
  const [mixTitle, setMixTitle] = useState('');
  const [toSounds, setToSounds] = useState({});
  const fromSoundsKeys = Object.keys(sounds).filter(
    (key) => !toSounds.hasOwnProperty(key)
  );

  const toggleSelected = (soundId) => {
    if (selectedSounds.has(soundId)) selectedSounds.delete(soundId);
    else selectedSounds.add(soundId);
    setSelectedSounds(new Set(selectedSounds));
  };

  const addToMix = () => {
    let count = 0;
    for (const soundId of selectedSounds) {
      if (Object.keys(toSounds).length + count > mixLimit) break;

      toSounds[soundId] = sounds[soundId];
      ++count;
    }
    setSelectedSounds(new Set());
    setToSounds({ ...toSounds });
  };

  const removeFromMix = () => {
    for (const soundId of selectedSounds) {
      if (toSounds.hasOwnProperty(soundId)) {
        delete toSounds[soundId];
      }
    }

    setToSounds({ ...toSounds });
    setSelectedSounds(new Set());
  };

  const createMix = (ev) => {
    ev.preventDefault();

    if (Object.keys(toSounds).length !== 0) {
      const onSuccess = () => {
        setMixTitle('');
        setSelectedSounds(new Set());
        setToSounds({});
      };

      const mix = {
        authorId: userId,
        title: mixTitle,
        soundIDs: Object.keys(toSounds),
      };
      dispatch(addMixAsync({ mix, onSuccess }));
    }
  };

  return (
    <form onSubmit={createMix}>
      <label className='block m-5 text-md text-center font-medium text-gray-700'>
        Add Mix
      </label>

      <div className='flex flex-col justify-center items-center mb-5'>
        <input
          className='shadow-sm appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='title'
          type='text'
          placeholder='Mix Title'
          required
          value={mixTitle}
          onChange={(ev) => setMixTitle(ev.target.value)}
        />
      </div>
      <div className='flex flex-col lg:flex-row'>
        <div className='bg-white h-40 max-h-40 overflow-auto rounded-md shadow-md lg:flex-1'>
          {fromSoundsKeys.map((soundId) => (
            <Track
              key={soundId}
              isSelcted={selectedSounds.has(soundId)}
              sound={sounds[soundId]}
              toggleSoundFile={toggleSoundFile}
              toggleSelected={toggleSelected}
            />
          ))}
        </div>
        <div className='flex justify-center items-center m-2 lg:flex-col'>
          <div>
            <ArrowCircleRightIcon
              className='h-10 w-10 text-gray-500 hover:text-black cursor-pointer rotate-90 lg:rotate-0'
              aria-hidden='true'
              onClick={addToMix}
            />
          </div>
          <div>
            <ArrowCircleLeftIcon
              className='h-10 w-10 text-gray-500 hover:text-black cursor-pointer rotate-90 lg:rotate-0'
              aria-hidden='true'
              onClick={removeFromMix}
            />
          </div>
        </div>
        <div className='bg-white h-40 max-h-40 overflow-auto rounded-md shadow-md lg:flex-1'>
          {Object.keys(toSounds).map((soundId) => (
            <Track
              key={soundId}
              isSelcted={selectedSounds.has(soundId)}
              sound={sounds[soundId]}
              toggleSelected={toggleSelected}
              toggleSoundFile={toggleSoundFile}
            />
          ))}
        </div>
      </div>

      <div className='flex flex-col justify-center items-center mt-5'>
        <button
          type='submit'
          className='disabled:text-gray-400 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          disabled={Object.keys(toSounds).length === 0}
        >
          Create Mix
        </button>
        <p className='text-xs text-gray-500 mt-1'>up to 5 sounds</p>
      </div>
    </form>
  );
}

export default AddMix;
