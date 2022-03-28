import React from 'react';
import { useSelector } from 'react-redux';
import { selectNoises } from '../../../store/redux/slices/noises';
import Noise from '../../Noise';

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

const NoiseGenerator = ({ userId }) => {
  const noises = useSelector(selectNoises);
  const noiseArray = Object.keys(noises).map(
    (noiseColor) => noises[noiseColor]
  );

  return (
    <div className='m-5'>
      <label className='block mb-10 text-md text-center font-medium text-gray-700'>
        Generate noise sounds. There are different{' '}
        <span className='font-bold italic'>colors</span> of noise and each
        impart a different feel.
      </label>
      {noiseArray.map((noise) => (
        <Noise
          key={noise.color}
          description={noiseDescriptions[noise.color]}
          noise={noise}
          noiseClassName={noiseBgColorClassNames[noise.color]}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default NoiseGenerator;
