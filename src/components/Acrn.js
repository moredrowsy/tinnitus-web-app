import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { ACRN, FREQ, VOLUME } from '../constants';
import { selectAcrns } from '../store/redux/slices/acrns';
import PlayButton from './PlayButton';

function Acrn({ acrnFreqChange, acrnVolChange, playerStorage, toggleTone }) {
  const acrns = useSelector(selectAcrns);
  const [type, setType] = useState(ACRN.type.tone);
  const [frequnecy, setFrequency] = useState(() => {
    if (playerStorage.hasOwnProperty(type)) {
      return Math.round(playerStorage[type].player.frequency.value);
    } else {
      return FREQ.default;
    }
  });
  const [volume, setVolume] = useState(() => {
    if (playerStorage.hasOwnProperty(type)) {
      return playerStorage[type].player.volume.value;
    } else {
      return VOLUME.default;
    }
  });

  let acrnState = 'stopped';
  switch (type) {
    case ACRN.type.tone:
      if (acrns.hasOwnProperty(type)) {
        acrnState = acrns[type].state;
      }
      break;
    case ACRN.type.sequence:
      if (acrns.hasOwnProperty(type)) {
        acrnState = acrns[type].state;
      }
      break;
    default:
      acrnState = 'stopped';
  }

  const onFreqChange = (newFreqValue) => {
    acrnFreqChange(newFreqValue);
    setFrequency(newFreqValue);
  };

  const onVolChange = (newVoValue) => {
    acrnVolChange(newVoValue);
    setVolume(newVoValue);
  };

  const onToggleAcrnPlay = () => {
    if (type === ACRN.type.tone) {
      toggleTone();
    }
  };

  return (
    <div className='flex justify-center items-stretch mb-5 bg-white shadow-md rounded'>
      <div className='flex-initial min-w-10 flex flex-col justify-center items-stretch bg-gray-200 rounded-tl rounded-bl'>
        <div
          className={`flex-1 flex justify-center items-center px-3 py-1 cursor-pointer ${
            type === ACRN.type.tone
              ? 'bg-gray-400 text-gray-100 rounded-tl'
              : ''
          }`}
          onClick={() => setType(ACRN.type.tone)}
        >
          Tone
        </div>
        <div className='border-b border-gray-400'></div>
        <div
          className={`flex-1 flex justify-center items-center px-3 py-1 cursor-pointer ${
            type === ACRN.type.sequence
              ? 'bg-gray-400 text-gray-100 rounded-tl'
              : ''
          }`}
          onClick={() => setType(ACRN.type.sequence)}
        >
          Sequence
        </div>
      </div>
      <div className='flex-1 flex flex-col justify-center bg-gray-200 md:bg-white border-l border-r border-gray-400 md:border-0'>
        <div className='text-center px-2'>
          <label htmlFor='frequnecy'>
            <span className='font-semibold text-gray-600 text-xs uppercase'>
              Frequency:
            </span>{' '}
            <span className='text-sm'>{frequnecy} Hz</span>
          </label>
          <input
            id='frequnecy'
            className='w-full h-2 bg-blue-400 md:bg-blue-100 appearance-none'
            type='range'
            min={FREQ.min}
            step='1'
            max={FREQ.max}
            value={frequnecy}
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
            className='w-full h-2 bg-blue-400 md:bg-blue-100 appearance-none'
            type='range'
            min={VOLUME.min}
            step='0.1'
            max={VOLUME.max}
            value={volume}
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
            status={acrnState}
            toggleFn={onToggleAcrnPlay}
          />
        </div>
      </div>
    </div>
  );
}

export default Acrn;
