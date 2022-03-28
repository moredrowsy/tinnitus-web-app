import React, { useState } from 'react';

// React Web
import PlayButton from './PlayButton';

// Redux
import { useSelector } from 'react-redux';
import { selectAcrns } from '../store/redux/slices/acrns';

import { ACRN, FREQ, VOLUME } from '../constants';
import { soundCache } from '../store/cache';

const Acrn = ({
  acrnFreqChange,
  acrnVolChange,
  toggleSequence,
  toggleTone,
}) => {
  const acrns = useSelector(selectAcrns);
  const [type, setType] = useState(ACRN.type.tone);
  const [frequency, setFrequency] = useState(() => {
    if (soundCache.hasOwnProperty(type)) {
      return Math.round(soundCache[type].player.frequency.value);
    } else {
      return FREQ.default;
    }
  });
  const [volume, setVolume] = useState(() => {
    if (soundCache.hasOwnProperty(type)) {
      return soundCache[type].player.volume.value;
    } else {
      return VOLUME.default;
    }
  });

  let acrnStatus = 'stopped';
  switch (type) {
    case ACRN.type.tone:
      if (acrns.hasOwnProperty(type)) {
        acrnStatus = acrns[type].status;
      }
      break;
    case ACRN.type.sequence:
      if (acrns.hasOwnProperty(type)) {
        acrnStatus = acrns[type].status;
      }
      break;
    default:
      acrnStatus = 'stopped';
  }

  const onFreqChange = (newFreqValue) => {
    acrnFreqChange(newFreqValue);
    setFrequency(newFreqValue);
  };

  const onVolChange = (newVolValue) => {
    acrnVolChange(newVolValue);
    setVolume(newVolValue);
  };

  const onToggleAcrnPlay = () => {
    if (type === ACRN.type.tone) {
      toggleTone();
    } else {
      toggleSequence(frequency, volume);
    }
  };

  let isDisabledBySequence = false;
  if (type === ACRN.type.sequence && acrns.hasOwnProperty(type)) {
    const { status } = acrns[type];

    if (status === 'started') {
      isDisabledBySequence = true;
    }
  }

  const sldierClasses = isDisabledBySequence
    ? 'bg-gray-100 md:bg-gray-100 accent-gray-100'
    : 'bg-blue-400 md:bg-blue-100 accent-pink-500 transition-opacity duration-300 opacity-50 hover:opacity-100';

  return (
    <div className='flex justify-center items-stretch mb-5 bg-white shadow-md rounded'>
      <div className='flex-initial min-w-10 flex flex-col justify-center items-stretch bg-gray-200 rounded-tl rounded-bl'>
        <button
          className={`flex-1 flex justify-center items-center px-3 py-1 cursor-pointer ${
            type === ACRN.type.tone
              ? 'bg-gray-400 text-gray-100 rounded-tl'
              : ''
          } ${isDisabledBySequence ? 'text-gray-300' : ''}`}
          disabled={isDisabledBySequence}
          onClick={() => setType(ACRN.type.tone)}
        >
          Tone
        </button>
        <div className='border-b border-gray-400'></div>
        <button
          className={`flex-1 flex justify-center items-center px-3 py-1 cursor-pointer ${
            type === ACRN.type.sequence
              ? 'bg-gray-400 text-gray-100 rounded-tl'
              : ''
          }`}
          onClick={() => setType(ACRN.type.sequence)}
        >
          Sequence
        </button>
      </div>
      <div className='flex-1 flex flex-col justify-center bg-gray-200 md:bg-white border-l border-r border-gray-400 md:border-0'>
        <div className='text-center px-2'>
          <label htmlFor='frequency'>
            <span className='font-semibold text-gray-600 text-xs uppercase'>
              Frequency:
            </span>{' '}
            <span className='text-sm'>{frequency} Hz</span>
          </label>
          <input
            id='frequency'
            className={`${sldierClasses} w-full h-2 rounded appearance-none`}
            type='range'
            min={FREQ.min}
            step={FREQ.step}
            max={FREQ.max}
            value={frequency}
            disabled={isDisabledBySequence}
            onChange={(ev) => onFreqChange(Number(ev.target.value))}
          />
        </div>
        <div className='pt-2 text-center px-2 '>
          <label htmlFor='volume'>
            <span className='font-semibold text-gray-600 text-xs uppercase'>
              Volume
            </span>
          </label>
          <input
            id='volume'
            className={`${sldierClasses} w-full h-2 rounded appearance-none`}
            type='range'
            min={VOLUME.min}
            step={VOLUME.step}
            max={VOLUME.max}
            value={volume}
            disabled={isDisabledBySequence}
            onChange={(ev) => onVolChange(Number(ev.target.value))}
          />
        </div>
      </div>
      <div className='flex-initial min-w-10 flex justify-center items-center bg-gray-200 rounded-tr rounded-br'>
        <div className='flext justify-center mx-2'>
          <PlayButton
            noneClassName={'h-10 w-10 text-gray-400'}
            playClassName={'h-10 w-10 text-blue-400'}
            pauseClassName={'h-10 w-10 text-orange-400'}
            downloadingClassName={'w-10 h-10 text-gray-800'}
            status={acrnStatus}
            toggleFn={onToggleAcrnPlay}
          />
        </div>
      </div>
    </div>
  );
};

export default Acrn;
