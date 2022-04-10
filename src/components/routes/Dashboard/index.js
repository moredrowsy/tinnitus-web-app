import React from 'react';

const Home = () => {
  return (
    <div className='m-5'>
      <div className='font-bold text-lg text-center mb-5'>
        Welcome to Tinnitus Relief - A Sound Therapy Application
      </div>
      <div className='font-bold text-lg text-center text-pink-700'>
        PLEASE LOWER YOUR VOLUME
      </div>
      <div className='font-bold text-lg text-center text-pink-700 mb-5'>
        BEFORE USING THIS APP TO PROTECT YOUR EARS
      </div>
      <div className='max-w-[640px] mx-auto'>
        <div className='mb-2'>Sound Therapy consists of:</div>
        <div className='mb-2'>
          - ACRN Tonal - Use the tone sound generator to test your tinnitus
          frequency
        </div>
        <div className='mb-2'>
          - ACRN Sequence - The sequence generator shoud be played at your
          tinnitus frequency
        </div>
        <div className='mb-2'>
          - Sounds - Play sounds uploaded by other users for masking your
          tinnitus
        </div>
        <div className='mb-2'>
          - Mixes - Create a combination of sounds for an immersive ambient
        </div>
      </div>
    </div>
  );
};

export default Home;
