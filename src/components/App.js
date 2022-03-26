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
  AcrnPage,
  Dashboard,
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
import { ACRN, FREQ, NOISE_COLOR, VOLUME } from '../constants';
import { setNoise, setNoises } from '../store/redux/slices/noises';
import { setAcrn } from '../store/redux/slices/acrns';
import { shuffleArray } from '../utils';

const navigation = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'ACRN', path: '/acrn', exact: true },
  { name: 'Noise', path: '/noise-gen', exact: true },
  { name: 'Sounds', path: '/sounds', exact: true },
  { name: 'Mixes', path: '/mixes', exact: true },
  { name: 'Upload', path: '/upload', exact: true },
];

function App() {
  const [user, loading, error] = useAuthState(auth);

  // Map of player storage: Each item is a json of { player }
  const [playerStorage, setPlayerStorage] = useState({});

  const soundFiles = useSelector(selectSoundFiles);

  const dispatch = useDispatch();
  const sounds = useSelector(selectSounds);
  const mixes = useSelector(selectMixes);
  const usernames = useSelector(selectUsernames);
  const userVotes = useSelector(selectUserVotes);

  // Add noise color players
  useEffect(() => {
    const noiseInfos = [];
    const noiseMap = {};

    NOISE_COLOR.forEach((noiseColor) => {
      if (!playerStorage.hasOwnProperty(noiseColor)) {
        const player = new Tone.Noise(noiseColor).toDestination();
        player.loop = true;
        noiseMap[noiseColor] = { player };

        const noiseInfo = { color: noiseColor, noise: { state: 'stopped' } };
        noiseInfos.push(noiseInfo);
      }
    });

    if (noiseInfos.length > 0) {
      dispatch(setNoises(noiseInfos));
    }

    if (Object.keys(noiseMap).length > 0) {
      setPlayerStorage({ ...playerStorage, ...noiseMap });
    }
  }, [dispatch, playerStorage]);

  // Add ACRN tone player
  useEffect(() => {
    if (!playerStorage.hasOwnProperty(ACRN.type.tone)) {
      const player = new Tone.Oscillator({
        frequency: FREQ.default,
      }).toDestination();
      player.loop = true;
      player.volume.value = VOLUME.default;
      playerStorage[ACRN.type.tone] = { player };
      dispatch(setAcrn({ type: ACRN.type.tone, acrn: { state: 'stopped' } }));
      setPlayerStorage({ ...playerStorage });
    }
  }, [dispatch, playerStorage]);

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
    playerStorage[storageKey] = { player };
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
        dispatch(updateSoundStatus({ id, status: 'started' }));
      }
      setPlayerStorage({ ...playerStorage });
    }
  };

  const startPlayer = (id, storageKey) => {
    if (storageKey in playerStorage) {
      const { player } = playerStorage[storageKey];

      player.start();
      dispatch(updateSoundStatus({ id, status: 'started' }));
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
        dispatch(updateSoundStatus({ id, status: 'started' }));
      };
      dispatch(getSoundFileAsync({ id, storageKey, onSuccess }));
    }
  };

  const toggleMix = ({ mixId, soundList }) => {
    if (mixes[mixId].status === 'started') {
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

        // started player files
        for (const sound of soundList) {
          const { id, storagePath: storageKey } = sound;

          if (playerStorage.hasOwnProperty(storageKey)) {
            const { player } = playerStorage[storageKey];
            player.start();
            dispatch(updateSoundStatus({ id, status: 'started' }));
          } else if (tempPlayerStorage.hasOwnProperty(storageKey)) {
            const { player } = tempPlayerStorage[storageKey];
            player.start();
            dispatch(updateSoundStatus({ id, status: 'started' }));
          }
        }

        setPlayerStorage({ ...playerStorage, ...tempPlayerStorage });
        dispatch(updateMixStatus({ id: mixId, status: 'started' }));
      };
      dispatch(getSoundFilesAsync({ sounds: soundList, onSuccess }));
    }
  };

  const toggleNoise = (noiseColor) => {
    const { player } = playerStorage[noiseColor];
    if (player.state === 'started') {
      player.stop();
    } else {
      player.start();
    }
    dispatch(setNoise({ color: noiseColor, noise: { state: player.state } }));
  };

  const acrnFreqChange = (newFreqValue) => {
    if (playerStorage.hasOwnProperty(ACRN.type.tone)) {
      const { player } = playerStorage[ACRN.type.tone];
      player.frequency.value = newFreqValue;
      setPlayerStorage({ ...playerStorage });
    }
  };

  const acrnVolChange = (newVolValue) => {
    if (playerStorage.hasOwnProperty(ACRN.type.tone)) {
      const { player } = playerStorage[ACRN.type.tone];
      player.volume.value = newVolValue;
      setPlayerStorage({ ...playerStorage });
    }
  };

  // @see acrn tool for frequencies randomness
  const genAcrnFrequencies = (freq) => [
    Math.floor(freq * 0.773 - 44.5),
    Math.floor(freq * 0.903 - 21.5),
    Math.floor(freq * 1.09 + 52),
    Math.floor(freq * 1.395 + 26.5),
  ];

  // @see acrn tool: content of events do not matter so can be anything
  // only need to ensure correct number of beats
  const genAcrnEvents = () => {
    const events = [];

    for (let i = 0; i < ACRN.sequence.loopRepeat; ++i) {
      events.push(...[0, 0, 0, 0]);
    }

    for (let i = 0; i < ACRN.sequence.restLength; ++i) {
      events.push([0]);
    }

    return events;
  };

  const onGenAcrnSequence = (freq, volume) => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.1,
        decay: 0.0,
        sustain: 0.07,
        release: 0.08,
      },
      volume,
    }).toDestination();

    let count = 0;
    const acrnEvents = genAcrnEvents();
    const acrnFrequencies = genAcrnFrequencies(freq);
    let curFrequencies = [];
    const maxPatternLength = ACRN.sequence.loopRepeat * acrnFrequencies.length;

    // Create sequence player
    const player = new Tone.Sequence((time, event) => {
      ++count;

      if (count < maxPatternLength) {
        if (curFrequencies.length === 0) {
          curFrequencies = shuffleArray(acrnFrequencies.slice());
        }
        synth.triggerAttackRelease(curFrequencies.pop(), '4n');
      } else {
        if (count >= maxPatternLength + ACRN.sequence.restLength) {
          count = 0;
        }
      }
    }, acrnEvents);

    // Check if seq is already playing; if so, stop it
    if (playerStorage.hasOwnProperty(ACRN.type.sequence)) {
      const { player: oldSeqPlayer } = playerStorage[ACRN.type.sequence];
      oldSeqPlayer.stop();
    }

    player.loop = true;
    playerStorage[ACRN.type.sequence] = { player };
    dispatch(setAcrn({ type: ACRN.type.sequence, acrn: { state: 'stopped' } }));
    setPlayerStorage({ ...playerStorage });
    return player;
  };

  const toggleSequence = (freq, volume) => {
    if (Tone.Transport.state === 'started') {
      const { player } = playerStorage[ACRN.type.sequence];
      player.stop();
      player.cancel();
      player.dispose();
      Tone.Transport.stop();
      dispatch(
        setAcrn({
          type: ACRN.type.sequence,
          acrn: { state: Tone.Transport.state },
        })
      );
    } else {
      const p = onGenAcrnSequence(freq, volume);
      p.start(0);
      Tone.Transport.start();
      dispatch(
        setAcrn({
          type: ACRN.type.sequence,
          acrn: { state: Tone.Transport.state },
        })
      );
    }
  };

  const toggleTone = () => {
    const { player } = playerStorage[ACRN.type.tone];
    if (player.state === 'started') {
      player.stop();
    } else {
      player.start();
    }
    dispatch(setAcrn({ type: ACRN.type.tone, acrn: { state: player.state } }));
  };

  return (
    <>
      <Navbar navigation={navigation} user={user} />
      <div id='app' className='bg-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route
              path='/acrn'
              element={
                <AcrnPage
                  acrnFreqChange={acrnFreqChange}
                  acrnVolChange={acrnVolChange}
                  onGenAcrnSequence={onGenAcrnSequence}
                  playerStorage={playerStorage}
                  toggleSequence={toggleSequence}
                  toggleTone={toggleTone}
                />
              }
            />
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
            <Route
              path='/noise-gen'
              element={<NoiseGenerator toggleNoise={toggleNoise} />}
            />
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
