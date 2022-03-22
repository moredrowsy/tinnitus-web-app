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

import './App.css';
import { Home, Mixes, SignIn, SignUp, Sounds, Upload } from './routes';
import Navbar from './Navbar';

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

  useEffect(() => {
    dispatch(updateSoundMetadatasAsync());
  }, [dispatch]);

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
                />
              }
            />
            <Route path='/upload' element={<Upload user={user} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
