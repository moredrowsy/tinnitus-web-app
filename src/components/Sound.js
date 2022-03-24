import React from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUsernameByIdAsync } from '../store/redux/slices/usernames';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../store/redux/slices/sounds';
import { formatDate } from '../utils';
import PlayButton from './PlayButton';

function Sound({ sound, toggleSoundFile, userId, usernames, userVotes }) {
  const dispatch = useDispatch();

  // Exit if no sound
  if (!sound) return null;

  // Check for usersname display
  const username = usernames[sound.authorId];
  if (username === undefined) {
    dispatch(getUsernameByIdAsync({ id: sound.authorId }));
  }

  // Check for vote status
  let voteCount = 0;
  if (sound.id in userVotes) {
    voteCount = Number(userVotes[sound.id].count);
  }

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, postId: sound.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, postId: sound.id }));
  };

  return (
    <div className='flex justify-center items-stretch mb-5 bg-white shadow-md rounded'>
      <div className='flex-initial min-w-10 flex flex-col justify-center items-center bg-gray-200 rounded-tl rounded-bl'>
        <div className='flex justify-center mx-3'>
          <ChevronUpIcon
            className={`h-6 w-6 ${
              voteCount > 0 ? 'text-red-400' : 'text-gray-400'
            } ${userId && voteCount <= 0 ? 'cursor-pointer' : ''}`}
            aria-hidden='true'
            onClick={
              voteCount > 0 || userId === undefined || userId === null
                ? null
                : incrementVote
            }
          />
        </div>
        <div className='flex justify-center -mt-3 -mb-3'>
          {sound.votes || 0}
        </div>
        <div className='flex justify-center mx-3'>
          <ChevronDownIcon
            className={`h-6 w-6 ${
              voteCount < 0 ? 'text-red-400' : 'text-gray-400'
            } ${userId && voteCount >= 0 ? 'cursor-pointer' : ''}`}
            aria-hidden='true'
            onClick={
              voteCount < 0 || userId === undefined || userId === null
                ? null
                : decrementVote
            }
          />
        </div>
      </div>
      <div className='flex-1 flex flex-col justify-center bg-gray-200 md:bg-white'>
        <div className='text-center md:border-b p-1 font-bold'>
          {sound.title}
        </div>
        <div className='hidden md:flex'>
          <div className='flex-1 text-xs p-1'>{username}</div>
          <div className='flex-1 text-xs p-1 flex justify-center'>
            <Link
              to={`/sounds/${sound.id}`}
              className='inline-block text-xs bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 hover:bg-gray-700 hover:text-white underline'
            >
              comments
            </Link>
          </div>
          <div className='flex-1 text-xs p-1 text-right'>
            {formatDate(sound.timestamp)}
          </div>
        </div>
        <div className='hidden md:flex md:p-1'>
          {sound.tags.map((tag) => (
            <span
              key={tag}
              className='inline-block text-xs bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-1'
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className='flex-initial min-w-10 flex justify-center items-center bg-gray-200 rounded-tr rounded-br'>
        <div className='flext justify-center mx-2'>
          <PlayButton
            noneClassName={'h-10 w-10 text-gray-400'}
            playClassName={'h-10 w-10 text-blue-400'}
            pauseClassName={'h-10 w-10 text-orange-400'}
            downloadingClassName={
              'w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-red-600'
            }
            status={sound.status}
            toggleFn={() =>
              toggleSoundFile({ id: sound.id, storageKey: sound.storagePath })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Sound;
