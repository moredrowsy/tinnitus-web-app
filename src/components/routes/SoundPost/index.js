import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';

import Sound from '../../Sound';
import Post from '../Post';

function SoundPost({
  path,
  sounds,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const { collectionId } = useParams();
  const postCollections = useSelector(selectPostCollections);
  const posts = postCollections[collectionId];
  const sound = sounds[collectionId];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <div className='m-5'>
      <Sound
        sound={sound}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
        usernames={usernames}
        userVotes={userVotes}
      />
      <Post path={path} posts={posts} userId={userId} usernames={usernames} />
    </div>
  );
}

export default SoundPost;
