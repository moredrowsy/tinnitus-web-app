import React, { useEffect, useState } from 'react';

// Redux
import { useDispatch } from 'react-redux';
import {
  addPostAsync,
  fetchPostsByCollectionIdAsync,
} from '../store/redux/slices/postCollections';

import { formatDate } from '../utils';

const Post = ({ collectionId, path, posts, userId, usernames }) => {
  const [body, setBody] = useState('');

  const dispatch = useDispatch();

  const addPost = () => {
    if (body) {
      const post = { authorId: userId, body, timestamp: Date.now() };
      dispatch(addPostAsync({ collectionId, post, path }));
      setBody('');
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    addPost();
  };

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='flex flex-col gap-4 items-center'>
          <textarea
            id='about'
            name='about'
            rows={3}
            className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2'
            placeholder='Type your message here'
            value={body}
            onChange={(ev) => setBody(ev.target.value)}
          />
          <div>
            <button
              type='submit'
              className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Submit Post
            </button>
          </div>
        </div>
      </form>
      <div className='mt-5'>
        {posts &&
          Object.keys(posts)
            .map((key) => ({ id: key, ...posts[key] }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((post) => {
              return (
                <div key={post.id} className='flex'>
                  <div className='flex-1 justify-center items-center mb-5 bg-white'>
                    <div className='rounded overflow-hidden shadow-lg'>
                      <div className='px-6 py-4'>
                        <div className='font-bold text-sm'>
                          {usernames[posts[post.id].authorId] || ''}
                        </div>
                        <p className='text-gray-700 text-base mt-5 mb-5'>
                          {posts[post.id].body}
                        </p>
                        <p className='text-xs text-gray-600 flex items-center"'>
                          {formatDate(posts[post.id].timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Post;
