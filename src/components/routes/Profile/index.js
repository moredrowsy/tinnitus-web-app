import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectUser,
  updateUserDisplayNameAsync,
} from '../../../store/redux/slices/user';

import { LockClosedIcon } from '@heroicons/react/solid';

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser);
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    setDisplayName(userProfile.displayName);
  }, [userProfile.displayName]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (userProfile !== displayName) {
      const onSuccess = () => {
        setErrMsg(null);
      };
      const onError = (err) => {
        setErrMsg('Something went wrong...');
      };
      dispatch(
        updateUserDisplayNameAsync(
          { displayName, userId: user.uid },
          onSuccess,
          onError
        )
      );
    }
  };

  if (!user) {
    return (
      <div className='block m-5 text-md text-center font-medium text-gray-700'>
        <Link className='underline' to='/signin'>
          Login
        </Link>{' '}
        or{' '}
        <Link className='underline' to='/signup'>
          create
        </Link>{' '}
        an account to upload files
      </div>
    );
  }

  return (
    <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Profile
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <input type='hidden' name='remember' defaultValue='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label
                htmlFor='email-address'
                className='text-sm uppercase font-semibold'
              >
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='mb-5 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={user.email}
                disabled={true}
              />
            </div>
            <div>
              <label
                htmlFor='displayName'
                className='text-sm uppercase font-semibold'
              >
                Display Name
              </label>
              <input
                id='displayName'
                name='displayName'
                type='text'
                autoComplete='current-displayName'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Display Name'
                value={displayName}
                onChange={(ev) => setDisplayName(ev.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <LockClosedIcon
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                  aria-hidden='true'
                />
              </span>
              Update Profile
            </button>
          </div>

          {errMsg && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center'
              role='alert'
            >
              <span className='block sm:inline'>{errMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
