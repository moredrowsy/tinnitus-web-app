import React, { useRef, useState } from 'react';
import {
  ArrowCircleRightIcon,
  ArrowCircleLeftIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';
import Track from '../../../Track';
import { mixLimit, tags } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { addMixAsync } from '../../../../store/redux/slices/mixes';

function AddMix({ sounds, toggleSoundFile, userId }) {
  const inputArrowRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedSounds, setSelectedSounds] = useState(new Set());
  const [mixTitle, setMixTitle] = useState('');
  const [mixTags, setMixTags] = useState(new Set());
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
        timestamp: Date.now(),
        tags: Array.from(mixTags),
        votes: 1,
      };
      dispatch(addMixAsync({ userId, mix, onSuccess }));

      if (inputArrowRef) {
        inputArrowRef.current.click();
      }

      setMixTags(new Set());
    }
  };

  const onToggleMixTag = (tag) => {
    if (mixTags.has(tag)) {
      mixTags.delete(tag);
    } else {
      mixTags.add(tag);
    }

    setMixTags(new Set(mixTags));
  };

  return (
    <div>
      <div className='relative w-full overflow-hidden'>
        <input
          ref={inputArrowRef}
          type='checkbox'
          className='peer absolute top-0 inset-x-0 w-full h-10 opacity-0 z-10 cursor-pointer'
        />
        <div className='bg-gray-700 h-10 w-full pl-3 flex items-center'>
          <h1 className='text-md font-semibold text-white'>Add Mix</h1>
        </div>
        {/* arrow down */}
        <div className='absolute top-2 right-3 text-white transition-transform rotate-0 peer-checked:rotate-180'>
          <ChevronDownIcon
            className='h-6 w-6 text-gray-200 cursor-pointer'
            aria-hidden='true'
          />
        </div>

        {/* Content */}
        <div className='overflow-hidden transition-all duration-500 max-h-0 peer-checked:max-h-fit'>
          <form onSubmit={createMix}>
            <div className='flex flex-col justify-center items-center mt-5 mb-5'>
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
                  <div className='border-b' key={soundId}>
                    <Track
                      isSelcted={selectedSounds.has(soundId)}
                      sound={sounds[soundId]}
                      toggleSoundFile={toggleSoundFile}
                      toggleSelected={toggleSelected}
                    />
                  </div>
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
              <div className='relative bg-white h-40 max-h-40 overflow-auto rounded-md shadow-md lg:flex-1'>
                {Object.keys(toSounds).map((soundId) => (
                  <Track
                    key={soundId}
                    isSelcted={selectedSounds.has(soundId)}
                    sound={sounds[soundId]}
                    toggleSelected={toggleSelected}
                    toggleSoundFile={toggleSoundFile}
                  />
                ))}
                {Object.keys(toSounds).length === 0 && (
                  <div className='absolute top-0 left-0 flex justify-center items-center w-full h-full'>
                    <div className='flex-1 text-center text-gray-400 uppercase text-sm'>
                      add items here
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex mt-5 justify-center items-center'>
              {tags.map((tag) => {
                const hasTag = mixTags.has(tag);
                let className =
                  'inline-block font-semibold px-3 py-1 rounded-full text-md hover:bg-gray-400 hover:text-white';
                const unSelectedColors = 'bg-gray-200 text-gray-700';
                const selectedColors = 'bg-gray-400 text-white';

                if (hasTag) {
                  className = `${className} ${selectedColors}`;
                } else {
                  className = `${className} ${unSelectedColors}`;
                }

                return (
                  <div
                    key={tag}
                    className={`text-center text-xs select-none mr-1 cursor-pointer ${className}`}
                    onClick={() => onToggleMixTag(tag)}
                  >
                    #{tag}
                  </div>
                );
              })}
            </div>
            <div className='flex flex-col justify-center items-center mt-5'>
              <button
                type='submit'
                className='disabled:text-gray-400 disabled:bg-white bg-rose-600 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                disabled={Object.keys(toSounds).length === 0 || !mixTitle}
              >
                Create Mix
              </button>
              <p className='text-xs text-gray-500 mt-1'>
                up to {mixLimit} tracks
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMix;
