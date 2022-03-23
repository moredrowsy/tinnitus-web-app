import React from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUsernameByIdAsync } from '../../../store/redux/slices/usernames';
import {
  decrementVoteAynsc,
  incrementVoteAynsc,
} from '../../../store/redux/slices/soundMetadatas';

function Sound({
  soundMetadata,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const dispatch = useDispatch();

  // Exit if not metadata
  if (!soundMetadata) return null;

  // Check for usersname display
  const username = usernames[soundMetadata.authorId];
  if (username === undefined) {
    dispatch(getUsernameByIdAsync({ id: soundMetadata.authorId }));
  }

  // Check for vote status
  let voteCount = 0;
  if (soundMetadata.id in userVotes) {
    voteCount = Number(userVotes[soundMetadata.id].count);
  }

  const incrementVote = () => {
    dispatch(incrementVoteAynsc({ userId, postId: soundMetadata.id }));
  };

  const decrementVote = () => {
    dispatch(decrementVoteAynsc({ userId, postId: soundMetadata.id }));
  };

  // Logic for sound button
  let soundButton;
  switch (soundMetadata.status) {
    case 'playing':
      soundButton = (
        <PauseIcon
          className='h-10 w-10 text-gray-400 cursor-pointer'
          aria-hidden='true'
          onClick={() =>
            toggleSoundFile({
              id: soundMetadata.id,
              storageKey: soundMetadata.storagePath,
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
              id: soundMetadata.id,
              storageKey: soundMetadata.storagePath,
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
              id: soundMetadata.id,
              storageKey: soundMetadata.storagePath,
            })
          }
        />
      );
  }

  return (
    <div className='flex' key={soundMetadata.id}>
      <div className='flex-1 justify-center items-center m-10 bg-white'>
        <div className='rounded overflow-hidden shadow-lg'>
          <div className='flex justify-start items-center font-bold text-xl mb-2 bg-gray-700 p-2 text-white'>
            <div className='flex-none flex flex-col justify-center items-start'>
              <ChevronUpIcon
                className={`h-5 w-7 ${
                  voteCount > 0 ? 'text-red-400' : 'text-gray-400'
                } ${userId && voteCount <= 0 ? 'cursor-pointer' : ''}`}
                aria-hidden='true'
                onClick={
                  voteCount > 0 || userId === undefined || userId === null
                    ? null
                    : incrementVote
                }
              />
              <div
                className={`-mt-2 -mb-2 h-7 w-7 font-bold text-xl rounded-full flex items-center justify-center font-mono ${
                  voteCount === 0 ? 'text-white' : 'text-red-400'
                }`}
              >
                {soundMetadata.votes || 0}
              </div>
              <ChevronDownIcon
                className={`h-5 w-7 ${
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
            <div className='flex-1 text-left'>{soundMetadata.title}</div>
            <div className='flex-1 text-right text-xs'>{username || ''}</div>
          </div>
          <div className='flex justify-center items-center'>
            <div className='flex-1 flex justify-center items-center'>
              {soundButton}
            </div>
          </div>
          <div className='flex justify-center px-6 pt-4 pb-2'>
            <Link
              to={`/sounds/${soundMetadata.id}`}
              className='inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-white hover:bg-gray-200 hover:text-gray-700 underline mr-2 mb-2'
            >
              Comments
            </Link>
          </div>
          <div className='px-6 pt-4 pb-2'>
            {soundMetadata.tags.map((tag) => (
              <span
                key={tag}
                className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sound;
