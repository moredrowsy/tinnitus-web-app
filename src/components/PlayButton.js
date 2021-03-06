import React from 'react';

// React Web
import {
  DotsCircleHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/outline';

const PlayButton = ({
  downloadingClassName,
  noneClassName,
  pauseClassName,
  playClassName,
  toggleFn,
  status,
}) => {
  // Logic for sound button
  let playButton;
  switch (status) {
    case 'started':
      playButton = (
        <PauseIcon
          className={`cursor-pointer animate-pulse ${pauseClassName}`}
          aria-hidden='true'
          onClick={toggleFn}
        />
      );
      break;
    case 'downloading':
      playButton = (
        <DotsCircleHorizontalIcon
          className={`cursor-pointer animate-spin ${downloadingClassName}`}
          aria-hidden='true'
          onClick={toggleFn}
        />
      );
      break;
    case 'none':
      playButton = (
        <PlayIcon
          className={`cursor-pointer ${noneClassName}`}
          aria-hidden='true'
          onClick={toggleFn}
        />
      );
      break;
    default:
      playButton = (
        <PlayIcon
          className={`cursor-pointer ${playClassName}`}
          aria-hidden='true'
          onClick={toggleFn}
        />
      );
  }

  return playButton;
};

export default PlayButton;
