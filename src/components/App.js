import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';
import { Howl } from 'howler';

import {
  selectMetadata,
  updateSoundMetadatasAsync,
  updateSoundMetadataStatus,
} from '../store/redux/slices/soundMetadatas';
import {
  addSoundFileAsync,
  selectSoundFiles,
} from '../store/redux/slices/soundFiles';
import {
  fetchUsernamesAsync,
  selectUsernames,
} from '../store/redux/slices/usernames';

import './App.css';
import { Home, Mixes, Posts, SignIn, SignUp, Sounds, Upload } from './routes';
import Navbar from './Navbar';
import {
  fetchUserVotesAsync,
  selectUserVotes,
} from '../store/redux/slices/userVotes';

const navigation = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'Sounds', path: '/sounds', exact: true },
  { name: 'Mixes', path: '/mixes', exact: true },
  { name: 'Upload', path: '/upload', exact: true },
];

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [howlStorage, setHowlStorage] = useState({});
  const soundFiles = useSelector(selectSoundFiles);
  const dispatch = useDispatch();
  const soundMetadas = useSelector(selectMetadata);
  const usernames = useSelector(selectUsernames);
  const userVotes = useSelector(selectUserVotes);

  useEffect(() => {
    dispatch(updateSoundMetadatasAsync());
    dispatch(fetchUsernamesAsync());
  }, [dispatch]);

  useEffect(() => {
    const userId = user ? user.uid : null;
    dispatch(fetchUserVotesAsync({ userId }));
  }, [dispatch, user]);

  const addHowl = ({ storageKey, dataURL }) => {
    if (storageKey in howlStorage) {
      howlStorage[storageKey].howl.stop();
    }

    const howl = new Howl({ src: dataURL, loop: true });
    howlStorage[storageKey] = { howl, play: false };
    setHowlStorage({ ...howlStorage });
  };

  const toggleSoundFile = async ({ id, storageKey }) => {
    // Check if there is a howl file
    if (storageKey in howlStorage) {
      const { howl, play } = howlStorage[storageKey];

      if (play) {
        howl.stop();
        howlStorage[storageKey].play = false;
        dispatch(updateSoundMetadataStatus({ id, status: 'stopped' }));
      } else {
        howl.play();
        howlStorage[storageKey].play = true;
        dispatch(updateSoundMetadataStatus({ id, status: 'playing' }));
      }
      setHowlStorage({ ...howlStorage });
    }
    // No howl file, need to download and then create a howl file
    else {
      const onSuccess = (dataURL) => {
        const howl = new Howl({
          src: [dataURL],
          loop: true,
        });
        howl.play();
        setHowlStorage({ ...howlStorage, [storageKey]: { howl, play: true } });
        dispatch(updateSoundMetadataStatus({ id, status: 'playing' }));
      };
      dispatch(addSoundFileAsync({ id, storageKey, onSuccess }));
    }
  };

  return (
    <>
      <Navbar navigation={navigation} user={user} />
      <div id='app' className='bg-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/mixes' element={<Mixes />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route
              path='/sounds'
              element={
                <Sounds
                  soundMetadas={soundMetadas}
                  toggleSoundFile={toggleSoundFile}
                  userId={user ? user.uid : null}
                  usernames={usernames}
                  userVotes={userVotes}
                />
              }
            />
            <Route
              path='/sounds/:collectionId'
              element={
                <Posts
                  path='sounds'
                  soundMetadas={soundMetadas}
                  toggleSoundFile={toggleSoundFile}
                  userId={user ? user.uid : null}
                  usernames={usernames}
                  userVotes={userVotes}
                />
              }
            />
            <Route
              path='/upload'
              element={<Upload user={user} addHowl={addHowl} />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
