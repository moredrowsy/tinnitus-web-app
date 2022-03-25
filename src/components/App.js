import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';
import { Howl } from 'howler';

import {
  selectSounds,
  fetchSoundsAsync,
  updateSoundStatus,
} from '../store/redux/slices/sounds';
import {
  getSoundFileAsync,
  getSoundFilesAsync,
  selectSoundFiles,
} from '../store/redux/slices/soundFiles';
import {
  fetchUsernamesAsync,
  selectUsernames,
} from '../store/redux/slices/usernames';

import './App.css';
import {
  Home,
  NoiseGenerator,
  Mixes,
  SoundPost,
  SignIn,
  SignUp,
  Sounds,
  Upload,
  MixPost,
  NotFound,
} from './routes';
import Navbar from './Navbar';
import {
  fetchUserVotesAsync,
  selectUserVotes,
} from '../store/redux/slices/userVotes';
import { fetchUserAsync } from '../store/redux/slices/user';
import {
  fetchMixesAsync,
  selectMixes,
  updateMixStatus,
} from '../store/redux/slices/mixes';

const navigation = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'Sounds', path: '/sounds', exact: true },
  { name: 'Mixes', path: '/mixes', exact: true },
  { name: 'Noise Gen', path: '/noise-gen', exact: true },
  { name: 'Upload', path: '/upload', exact: true },
];

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [howlStorage, setHowlStorage] = useState({});
  const soundFiles = useSelector(selectSoundFiles);
  const dispatch = useDispatch();
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);
  const usernames = useSelector(selectUsernames);
  const userVotes = useSelector(selectUserVotes);

  // Fetch and update user information
  // Only fetch when user object is different
  useEffect(() => {
    if (user) {
      dispatch(fetchUserAsync({ userId: user.uid }));
    }

    // Fetch user vote information
    const userId = user ? user.uid : null;
    dispatch(fetchUserVotesAsync({ userId }));
  }, [dispatch, user]);

  // Update sound and usernames information
  useEffect(() => {
    dispatch(fetchUsernamesAsync());
    dispatch(fetchSoundsAsync());
    dispatch(fetchMixesAsync());
  }, [dispatch]);

  const addHowl = ({ storageKey, dataURL }) => {
    if (storageKey in howlStorage) {
      howlStorage[storageKey].howl.stop();
    }

    const howl = new Howl({ src: dataURL, loop: true });
    howlStorage[storageKey] = { howl, play: false };
    setHowlStorage({ ...howlStorage });
  };

  const toggleHowl = (id, storageKey) => {
    if (storageKey in howlStorage) {
      const { howl, play } = howlStorage[storageKey];

      if (play) {
        howl.stop();
        howlStorage[storageKey].play = false;
        dispatch(updateSoundStatus({ id, status: 'stopped' }));
      } else {
        howl.play();
        howlStorage[storageKey].play = true;
        dispatch(updateSoundStatus({ id, status: 'playing' }));
      }
      setHowlStorage({ ...howlStorage });
    }
  };

  const playHowl = (id, storageKey) => {
    if (storageKey in howlStorage) {
      const { howl, play } = howlStorage[storageKey];

      howl.play();
      howlStorage[storageKey].play = true;
      dispatch(updateSoundStatus({ id, status: 'playing' }));
      setHowlStorage({ ...howlStorage });
    }
  };

  const stopHowl = (id, storageKey) => {
    if (storageKey in howlStorage) {
      const { howl, play } = howlStorage[storageKey];

      howl.stop();
      howlStorage[storageKey].play = false;
      dispatch(updateSoundStatus({ id, status: 'stopped' }));
      setHowlStorage({ ...howlStorage });
    }
  };

  const toggleSoundFile = async ({ id, storageKey }) => {
    // Check if there is a howl file
    if (storageKey in howlStorage) {
      toggleHowl(id, storageKey);
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
        dispatch(updateSoundStatus({ id, status: 'playing' }));
      };
      dispatch(getSoundFileAsync({ id, storageKey, onSuccess }));
    }
  };

  const toggleMix = ({ mixId, soundList }) => {
    if (mixes[mixId].status === 'playing') {
      for (const sound of soundList) {
        const { id, storagePath: storageKey } = sound;

        stopHowl(id, storageKey);
      }
      dispatch(updateMixStatus({ id: mixId, status: 'stopped' }));
    } else {
      dispatch(updateMixStatus({ id: mixId, status: 'downloading' }));

      const onSuccess = (datas) => {
        const tempHowlStorage = {};

        // Build temporary howl storage
        for (const data of datas) {
          const { storageKey, dataURL } = data;

          // Create howl
          const howl = new Howl({
            src: [dataURL],
            loop: true,
          });

          tempHowlStorage[storageKey] = { howl, play: true };
        }

        // Playing howl files
        for (const sound of soundList) {
          const { id, storagePath: storageKey } = sound;

          if (howlStorage.hasOwnProperty(storageKey)) {
            const { howl } = howlStorage[storageKey];
            howl.play();
            dispatch(updateSoundStatus({ id, status: 'playing' }));
          } else if (tempHowlStorage.hasOwnProperty(storageKey)) {
            const { howl } = tempHowlStorage[storageKey];
            howl.play();
            dispatch(updateSoundStatus({ id, status: 'playing' }));
          }
        }

        setHowlStorage({ ...howlStorage, ...tempHowlStorage });
        dispatch(updateMixStatus({ id: mixId, status: 'playing' }));
      };
      dispatch(getSoundFilesAsync({ sounds: soundList, onSuccess }));
    }
  };

  return (
    <>
      <Navbar navigation={navigation} user={user} />
      <div id='app' className='bg-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/mixes'
              element={
                <Mixes
                  mixes={mixes}
                  sounds={sounds}
                  toggleMix={toggleMix}
                  toggleSoundFile={toggleSoundFile}
                  userId={user ? user.uid : null}
                  usernames={usernames}
                  userVotes={userVotes}
                />
              }
            />
            <Route
              path='/mixes/:collectionId'
              element={
                <MixPost
                  mixes={mixes}
                  path='mixes'
                  sounds={sounds}
                  toggleMix={toggleMix}
                  toggleSoundFile={toggleSoundFile}
                  userId={user ? user.uid : null}
                  usernames={usernames}
                  userVotes={userVotes}
                />
              }
            />
            <Route path='/noise-gen' element={<NoiseGenerator />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route
              path='/sounds'
              element={
                <Sounds
                  sounds={sounds}
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
                <SoundPost
                  path='sounds'
                  sounds={sounds}
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
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
