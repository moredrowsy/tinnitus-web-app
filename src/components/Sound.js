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

  // Logic for sound button
  let soundButton;
  switch (sound.status) {
    case 'playing':
      soundButton = (
        <PauseIcon
          className='h-10 w-10 text-orange-400 cursor-pointer animate-pulse'
          aria-hidden='true'
          onClick={() =>
            toggleSoundFile({
              id: sound.id,
              storageKey: sound.storagePath,
            })
          }
        />
      );
      break;
    case 'downloading':
      soundButton = (
        <svg
          role='status'
          className='inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-red-600'
          viewBox='0 0 100 101'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
            fill='currentColor'
          />
          <path
            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
            fill='currentFill'
          />
        </svg>
      );
      break;
    case 'none':
      soundButton = (
        <PlayIcon
          className='h-10 w-10 text-gray-400 cursor-pointer'
          aria-hidden='true'
          onClick={() =>
            toggleSoundFile({
              id: sound.id,
              storageKey: sound.storagePath,
            })
          }
        />
      );
      break;
    default:
      soundButton = (
        <PlayIcon
          className='h-10 w-10 text-blue-400 cursor-pointer'
          aria-hidden='true'
          onClick={() =>
            toggleSoundFile({
              id: sound.id,
              storageKey: sound.storagePath,
            })
          }
        />
      );
  }

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
        <div className='text-center md:border-b p-1'>{sound.title}</div>
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
        <div className='flext justify-center mx-2'>{soundButton}</div>
      </div>
    </div>
  );
}

export default Sound;
