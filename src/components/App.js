import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../store/firebase';

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

import * as Tone from 'tone';

const navigation = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'Sounds', path: '/sounds', exact: true },
  { name: 'Mixes', path: '/mixes', exact: true },
  { name: 'Noise Gen', path: '/noise-gen', exact: true },
  { name: 'Upload', path: '/upload', exact: true },
];

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [playerStorage, setPlayerStorage] = useState({});
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

  const addPlayer = async ({ storageKey, dataURL }) => {
    if (storageKey in playerStorage) {
      playerStorage[storageKey].player.stop();
    }

    const player = new Tone.Player().toDestination();
    player.loop = true;

    await player.load(dataURL);
    playerStorage[storageKey] = { player, play: false };
    setPlayerStorage({ ...playerStorage });
  };

  const togglePlayer = (id, storageKey) => {
    if (storageKey in playerStorage) {
      const { player } = playerStorage[storageKey];

      if (player.state === 'started') {
        player.stop();
        dispatch(updateSoundStatus({ id, status: 'stopped' }));
      } else {
        player.start();
        dispatch(updateSoundStatus({ id, status: 'played' }));
      }
      setPlayerStorage({ ...playerStorage });
    }
  };

  const startPlayer = (id, storageKey) => {
    if (storageKey in playerStorage) {
      const { player } = playerStorage[storageKey];

      player.start();
      dispatch(updateSoundStatus({ id, status: 'played' }));
      setPlayerStorage({ ...playerStorage });
    }
  };

  const stopPlayer = (id, storageKey) => {
    if (storageKey in playerStorage) {
      const { player } = playerStorage[storageKey];

      player.stop();
      dispatch(updateSoundStatus({ id, status: 'stopped' }));
      setPlayerStorage({ ...playerStorage });
    }
  };

  const toggleSoundFile = async ({ id, storageKey }) => {
    // Check if there is a sound player in storage
    if (storageKey in playerStorage) {
      togglePlayer(id, storageKey);
    }
    // No sound player, need to dl and load file to new player
    else {
      const onSuccess = async (dataURL) => {
        const player = new Tone.Player().toDestination();
        player.loop = true;

        await player.load(dataURL);
        setPlayerStorage({
          ...playerStorage,
          [storageKey]: { player },
        });

        player.start();
        dispatch(updateSoundStatus({ id, status: 'played' }));
      };
      dispatch(getSoundFileAsync({ id, storageKey, onSuccess }));
    }
  };

  const toggleMix = ({ mixId, soundList }) => {
    if (mixes[mixId].status === 'played') {
      for (const sound of soundList) {
        const { id, storagePath: storageKey } = sound;

        stopPlayer(id, storageKey);
      }
      dispatch(updateMixStatus({ id: mixId, status: 'stopped' }));
    } else {
      dispatch(updateMixStatus({ id: mixId, status: 'downloading' }));

      const onSuccess = async (datas) => {
        const tempPlayerStorage = {};

        // Build temporary player storage
        for (const data of datas) {
          const { storageKey, dataURL } = data;

          // Create player
          const player = new Tone.Player().toDestination();
          player.loop = true;

          await player.load(dataURL);
          tempPlayerStorage[storageKey] = { player };
        }

        // played player files
        for (const sound of soundList) {
          const { id, storagePath: storageKey } = sound;

          if (playerStorage.hasOwnProperty(storageKey)) {
            const { player } = playerStorage[storageKey];
            player.start();
            dispatch(updateSoundStatus({ id, status: 'played' }));
          } else if (tempPlayerStorage.hasOwnProperty(storageKey)) {
            const { player } = tempPlayerStorage[storageKey];
            player.start();
            dispatch(updateSoundStatus({ id, status: 'played' }));
          }
        }

        setPlayerStorage({ ...playerStorage, ...tempPlayerStorage });
        dispatch(updateMixStatus({ id: mixId, status: 'played' }));
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
              element={<Upload user={user} addPlayer={addPlayer} />}
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
