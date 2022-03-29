import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUsernameByIdAsync } from '../store/redux/slices/usernames';
import { formatDate } from '../utils';
import PlayButton from './PlayButton';

const Item = ({
  children,
  commentLink,
  decrementVote,
  incrementVote,
  item,
  toggleFn,
  userId,
  usernames,
  userVote,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Exit if no item
  if (!item) return null;

  // Check for usersname display
  const username = usernames[item.authorId];
  if (username === undefined) {
    dispatch(getUsernameByIdAsync({ id: item.authorId }));
  }

  const goToComment = () => {
    navigate(commentLink);
  };

  return (
    <div className='flex justify-center items-stretch mb-5 bg-white shadow-md rounded'>
      <div className='flex-initial min-w-10 flex flex-col justify-center items-center bg-gray-200 rounded-tl rounded-bl'>
        <div className='flex justify-center mx-3'>
          <ChevronUpIcon
            className={`h-6 w-6 ${
              userVote > 0 ? 'text-red-400' : 'text-gray-400'
            } ${userId && userVote <= 0 ? 'cursor-pointer' : ''}`}
            aria-hidden='true'
            onClick={
              userVote > 0 || userId === undefined || userId === null
                ? null
                : incrementVote
            }
          />
        </div>
        <div className='flex justify-center -mt-3 -mb-3'>{item.votes || 0}</div>
        <div className='flex justify-center mx-3'>
          <ChevronDownIcon
            className={`h-6 w-6 ${
              userVote < 0 ? 'text-red-400' : 'text-gray-400'
            } ${userId && userVote >= 0 ? 'cursor-pointer' : ''}`}
            aria-hidden='true'
            onClick={
              userVote < 0 || userId === undefined || userId === null
                ? null
                : decrementVote
            }
          />
        </div>
      </div>
      <div className='flex-1 flex flex-col justify-center bg-gray-200 md:bg-white'>
        {/* Show when screen is size sm; otherwise hidden when size md or larger*/}
        <div
          className='md:hidden text-sm text-center p-1 font-bold cursor-pointer underline underline-offset-4'
          onClick={goToComment}
        >
          {item.title}
        </div>
        <div className='flex-1 md:hidden text-[0.7em] p-1 text-center -mt-2'>
          {username}
        </div>
        {/* Show when screen is size md or larger; otherwise hidden */}
        <div className='hidden md:block md:text-md text-center md:border-b p-1 font-bold md:cursor-default'>
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
        <div className='flex'>
          <div className='flex-1 text-xs flex justify-center items-center'>
            <div className='flex-1'>{children}</div>
          </div>
        </div>
        <div className='md:m-1'>
          {item.tags &&
            item.tags.map((tag) => (
              <span key={tag}>
                <span className='inline-block md:hidden text-xs bg-gray-300 rounded-full px-1 font-semibold text-gray-700 mr-1'>
                  #{tag}
                </span>
                <span className='hidden md:inline-block text-xs bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-1'>
                  #{tag}
                </span>
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
};

export default Item;
