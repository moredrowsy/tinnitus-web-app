import React from 'react';
import Acrn from '../../Acrn';

const AcrnPage = ({
  acrnFreqChange,
  acrnVolChange,
  onGenAcrnSequence,
  playerStorage,
  toggleSequence,
  toggleTone,
}) => {
  return (
    <div className='m-5'>
      <div className='bloc text-md text-center text-gray-700'>
        <span className='font-bold'>A</span>coustic{' '}
        <span className='font-bold'>C</span>oordinated{' '}
        <span className='font-bold'>R</span>eset{' '}
        <span className='font-bold'>N</span>euromodulation
      </div>
      <div className='text-center text-sm mb-5'>
        You can find more information from this{' '}
        <a
          className='underline text-blue-500'
          href='https://pubmed.ncbi.nlm.nih.gov/22414611/'
        >
          research article
        </a>
      </div>
      <Acrn
        acrnFreqChange={acrnFreqChange}
        acrnVolChange={acrnVolChange}
        onGenAcrnSequence={onGenAcrnSequence}
        playerStorage={playerStorage}
        toggleSequence={toggleSequence}
        toggleTone={toggleTone}
      />
    </div>
  );
};

export default AcrnPage;
