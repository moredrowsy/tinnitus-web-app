import React, { useState } from 'react';
import * as Tone from 'tone';
import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { noiseColors } from '../../../constants';

const noiseBgColorClassNames = {
  brown: 'bg-light-brown',
  pink: 'bg-pink-300',
  white: 'bg-white',
};

const noiseDescriptions = {
  white:
    'It contains all frequencies at equal intensity. Sounds like untuned radio or old television static. ',
  pink: 'It is a white noise but with reduced higher frequencies. It is often considered more soothing than white noise.',
  brown:
    'Similar to pink noise but with evenmore reduced higher frequencies. It sounds similar to river or strong wind.',
};

function NoiseGenerator() {
  const [noises] = useState(() => {
    const noiseMap = {};
    noiseColors.forEach(
      (noiseColor) =>
        (noiseMap[noiseColor] = new Tone.Noise(noiseColor).toDestination())
    );
    return noiseMap;
  });
  const [isNoisesPlaying, setIsNoisesPlaying] = useState(() => {
    const noiseStateMap = {};
    noiseColors.forEach((noiseColor) => (noiseStateMap[noiseColor] = false));
    return noiseStateMap;
  });

  const toggleNoise = (noiseColor) => {
    const noise = noises[noiseColor];
    if (noise.state === 'started') {
      noise.stop();
      isNoisesPlaying[noiseColor] = false;
    } else {
      noise.start();
      isNoisesPlaying[noiseColor] = true;
    }
    setIsNoisesPlaying({ ...isNoisesPlaying });
  };

  return (
    <div className='m-5'>
      <label className='block mb-10 text-md text-center font-medium text-gray-700'>
        Generate noise sounds. There are different{' '}
        <span className='font-bold italic'>colors</span> of noise and each
        impart a different feel.
      </label>
      {Object.keys(noises).map((noiseColor) => (
        <div key={noiseColor} className='flex  justify-center shadow-md mb-5'>
          <div
            className={`${noiseBgColorClassNames[noiseColor]} flex-1 flex flex-col justify-center items-stretch rounded-tl rounded-bl p-1`}
          >
            <div className='relative flex-1 flex justify-center items-center text-sm uppercase font-bold text-center'>
              {noiseColor} noise
              <div className='hidden absolute top-5 border-b w-32 md:flex justify-center'></div>
            </div>
            <div className='hidden md:flex md:justify-center md:items-center p-2'>
              {noiseDescriptions[noiseColor]}
            </div>
          </div>
          <div
            className={`${noiseBgColorClassNames[noiseColor]} rounded-tr rounded-br flex justify-center items-center`}
          >
            {isNoisesPlaying[noiseColor] ? (
              <PauseIcon
                className={`cursor-pointer w-12 h-12 text-gray-600`}
                aria-hidden='true'
                onClick={() => toggleNoise(noiseColor)}
              />
            ) : (
              <PlayIcon
                className={`cursor-pointer w-12 h-12 text-gray-600`}
                aria-hidden='true'
                onClick={() => toggleNoise(noiseColor)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NoiseGenerator;
