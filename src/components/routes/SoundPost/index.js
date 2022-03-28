import React, { useEffect } from 'react';

// React Web
import { useParams } from 'react-router-dom';
import Sound from '../../Sound';
import Post from '../Post';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';
import { selectSounds } from '../../../store/redux/slices/sounds';

function SoundPost({ path, userId, usernames }) {
  const { collectionId } = useParams();
  const sounds = useSelector(selectSounds);
  const postCollections = useSelector(selectPostCollections);
  const posts = postCollections[collectionId];
  const sound = sounds[collectionId];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <div className='m-5'>
      <Sound sound={sound} userId={userId} usernames={usernames} />
      <Post path={path} posts={posts} userId={userId} usernames={usernames} />
    </div>
  );
}

export default SoundPost;
