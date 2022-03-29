import React from 'react';

// React Web
import { Link } from 'react-router-dom';

function NeedAuthedUserMsg({ authed, msg }) {
  if (!authed) {
    return (
      <div className='block m-5 text-md text-center font-medium text-gray-700'>
        <Link className='underline' to='/signin'>
          Login
        </Link>{' '}
        or{' '}
        <Link className='underline' to='/signup'>
          create
        </Link>{' '}
        an account {msg}
      </div>
    );
  }
}

export default NeedAuthedUserMsg;
