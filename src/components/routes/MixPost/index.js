import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';

import Mix from '../../Mix';
import Post from '../Post';

function MixPost({
  mixes,
  path,
  sounds,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
  userVotes,
}) {
  const { collectionId } = useParams();
  const postCollections = useSelector(selectPostCollections);
  const posts = postCollections[collectionId];
  const mix = mixes[collectionId];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
  }, [dispatch, collectionId, path]);

  return (
    <div className='m-5'>
      <Mix
        mix={mix}
        sounds={sounds}
        toggleMix={toggleMix}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
        usernames={usernames}
        userVotes={userVotes}
      />
      <Post path={path} posts={posts} userId={userId} usernames={usernames} />
    </div>
  );
}

export default MixPost;
