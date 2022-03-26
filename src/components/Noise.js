import React, { useState } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { VOLUME } from '../constants';

function Noise({
  changeNoiseVolume,
  description,
  noise,
  noiseClassName,
  toggleNoise,
}) {
  const [volume, setVolume] = useState(noise ? noise.volume : VOLUME.default);

  const onVolChange = (newVolValue) => {
    setVolume(newVolValue);
    changeNoiseVolume({ color: noise.color, volume });
  };

  return (
    <div className='flex  justify-center shadow-md mb-5'>
      <div
        className={`${noiseClassName} flex-1 flex flex-col justify-center items-stretch rounded-tl rounded-bl p-1`}
      >
        <div className='relative flex-1 flex justify-center items-center text-sm uppercase font-bold text-center'>
          {noise.color} noise
          <div className='hidden absolute top-5 border-b w-32 md:flex justify-center'></div>
        </div>
        <div className='hidden md:flex md:justify-center md:items-center p-2'>
          {description}
        </div>
        <div className='relative flex-1 flex justify-center items-center text-sm uppercase font-bold text-center'>
          <input
            className='appearance-none w-full h-2 bg-blue-100 accent-pink-500 rounded'
            type='range'
            min={VOLUME.min}
            step={VOLUME.step}
            max={VOLUME.max}
            value={volume}
            onChange={(ev) => onVolChange(Number(ev.target.value))}
          />
        </div>
      </div>
      <div
        className={`${noiseClassName} rounded-tr rounded-br flex justify-center items-center`}
      >
        {noise.status === 'started' ? (
          <PauseIcon
            className={`cursor-pointer w-12 h-12 text-gray-600`}
            aria-hidden='true'
            onClick={() => toggleNoise(noise.color)}
          />
        ) : (
          <PlayIcon
            className={`cursor-pointer w-12 h-12 text-gray-600`}
            aria-hidden='true'
            onClick={() => toggleNoise(noise.color)}
          />
        )}
      </div>
    </div>
  );
}

export default Noise;
