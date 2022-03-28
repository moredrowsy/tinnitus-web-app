import React, { useState } from 'react';

// React Web
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/solid';

// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../store/firebase';

import EarLogo from '../../../assets/images/ear-logo.svg';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState(null);

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.email,
      });

      setErrMsg(null);
      navigate('/');
    } catch (err) {
      const errCode = err.code;

      console.log({ errCode });

      if (errCode === 'auth/email-already-in-use') {
        setErrMsg('Email already in use');
      } else if (errCode === 'auth/weak-password') {
        setErrMsg('Password must be 6 or more characters long.');
      } else {
        setErrMsg('Something went wrong');
      }
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    signUp();
  };

  return (
    <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <img className='mx-auto h-12 w-auto' src={EarLogo} alt='EarLogo' />
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create an account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <input type='hidden' name='remember' defaultValue='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
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
              Sign up
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
}

export default SignUp;
