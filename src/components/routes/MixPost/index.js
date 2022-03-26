import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPostCollections,
  fetchPostsByCollectionIdAsync,
} from '../../../store/redux/slices/postCollections';

import Mix from '../../Mix';
import Post from '../Post';
import { selectSounds } from '../../../store/redux/slices/sounds';
import { selectMixes } from '../../../store/redux/slices/mixes';

function MixPost({
  changeSoundVolume,
  path,
  toggleMix,
  toggleSoundFile,
  userId,
  usernames,
}) {
  const { collectionId } = useParams();
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);
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
        changeSoundVolume={changeSoundVolume}
        mix={mix}
        sounds={sounds}
        toggleMix={toggleMix}
        toggleSoundFile={toggleSoundFile}
        userId={userId}
        usernames={usernames}
      />
      <Post path={path} posts={posts} userId={userId} usernames={usernames} />
    </div>
  );
}

export default MixPost;
