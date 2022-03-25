import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUsernameByIdAsync } from '../store/redux/slices/usernames';
import { formatDate } from '../utils';
import PlayButton from './PlayButton';

function Item({
  children,
  commentLink,
  decrementVote,
  incrementVote,
  item,
  toggleFn,
  userId,
  usernames,
  userVotes,
}) {
  const dispatch = useDispatch();

  // Exit if no item
  if (!item) return null;

  // Check for usersname display
  const username = usernames[item.authorId];
  if (username === undefined) {
    dispatch(getUsernameByIdAsync({ id: item.authorId }));
  }

  // Check for vote status
  let voteCount = 0;
  if (item.id in userVotes) {
    voteCount = Number(userVotes[item.id].count);
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
        <div className='flex justify-center -mt-3 -mb-3'>{item.votes || 0}</div>
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
          {item.title}
        </div>
        <div className='hidden md:flex md:justify-center md:items-center'>
          <div className='flex-1 text-xs p-1'>{username}</div>
          <div className='flex-1 text-xs p-1 flex justify-center'>
            <Link
              to={commentLink}
              className='inline-block text-xs bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 hover:bg-gray-700 hover:text-white underline'
            >
              comments
            </Link>
          </div>
          <div className='flex-1 text-xs p-1 text-right'>
            {formatDate(item.timestamp)}
          </div>
        </div>
        <div className='hidden md:flex'>
          <div className='flex-1 text-xs p-1 flex justify-center items-center'>
            <div className='flex-1'>{children}</div>
          </div>
        </div>
        <div className='hidden md:flex md:p-1'>
          {item.tags &&
            item.tags.map((tag) => (
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
            downloadingClassName={'w-10 h-10 text-gray-800'}
            status={item.status}
            toggleFn={toggleFn}
          />
        </div>
      </div>
    </div>
  );
}

export default Item;
