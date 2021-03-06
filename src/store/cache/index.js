// Web only
import * as Tone from 'tone';

// Redux
import { updateMix, updateMixStatus } from '../redux/slices/mixes';
import { setNoise, updateNoiseVolume } from '../redux/slices/noises';
import {
  getSoundFileAsync,
  getSoundFilesAsync,
} from '../redux/slices/soundFiles';
import {
  updateSound,
  updateSoundStatus,
  updateSoundVolume,
} from '../redux/slices/sounds';
import {
  updateNoiseVolumeAsync,
  updateUserMixTrackVolumeAsync,
  updateUserSoundVolumeAsync,
} from '../redux/slices/user';

import { DEBOUNCE_WAIT, VOLUME } from '../../constants';
import { debounce } from '../../utils';

export const soundCache = {};

const changeNoiseVolumeDebounce = debounce(
  ({ color, dispatch, userId, volume }) => {
    try {
      dispatch(updateNoiseVolume({ color, volume }));
      dispatch(
        updateNoiseVolumeAsync({
          color,
          userId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export function changeNoiseVolume({ color, dispatch, userId, volume }) {
  if (soundCache.hasOwnProperty(color)) {
    const { player } = soundCache[color];
    player.volume.value = volume;
  }
  changeNoiseVolumeDebounce({ color, dispatch, userId, volume });
}

export function toggleNoise({ color, dispatch, volume }) {
  const { player } = soundCache[color];
  if (player.state === 'started') {
    player.stop();
  } else {
    player.volume.value = volume;
    player.start();
  }
  dispatch(setNoise({ noise: { color, status: player.state } }));
}

export function toggleSound({ dispatch, id, storageKey, volume }) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    player.volume.value = volume;

    if (player.state === 'started') {
      player.stop();
      dispatch(updateSoundStatus({ id, status: 'stopped' }));
    } else {
      player.start();
      dispatch(updateSoundStatus({ id, status: 'started' }));
    }
  }
}

export async function toggleSoundFile({ dispatch, id, storageKey, volume }) {
  // Check if there is a sound player in storage
  if (soundCache.hasOwnProperty(storageKey)) {
    toggleSound({ dispatch, id, storageKey, volume });
  }
  // No sound player, need to dl and load file to new player
  else {
    const onSuccess = async (dataURL) => {
      const player = new Tone.Player().toDestination();
      player.loop = true;
      player.volume.value = volume;

      await player.load(dataURL);
      soundCache[storageKey] = { player };
      player.start();

      dispatch(
        updateSound({
          id,
          sound: { status: 'started', volume: VOLUME.default },
        })
      );
    };
    dispatch(getSoundFileAsync({ id, storageKey, onSuccess }));
  }
}

const changeSoundVolumeDebounce = debounce(
  ({ dispatch, soundId, userId, volume }) => {
    try {
      dispatch(updateSoundVolume({ id: soundId, volume }));
      dispatch(
        updateUserSoundVolumeAsync({
          userId,
          soundId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export function changeSoundVolume({
  dispatch,
  soundId,
  storageKey,
  userId,
  volume,
}) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    player.volume.value = volume;
  }

  changeSoundVolumeDebounce({ dispatch, soundId, userId, volume });
}

const stopPlayer = ({ dispatch, id, storageKey }) => {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];

    player.stop();
    dispatch(updateSoundStatus({ id, status: 'stopped' }));
  }
};

export function toggleMix({ dispatch, mix, soundList, userMix }) {
  if (mix.status === 'started') {
    for (const sound of soundList) {
      const { id, storagePath: storageKey } = sound;

      stopPlayer({ dispatch, id, storageKey });
    }
    dispatch(updateMixStatus({ id: mix.id, status: 'stopped' }));
  } else {
    dispatch(updateMixStatus({ id: mix.id, status: 'downloading' }));

    const onSuccess = async (datas) => {
      // Build temporary player storage
      for (const data of datas) {
        const { storageKey, dataURL } = data;

        // Create player
        const player = new Tone.Player().toDestination();
        player.loop = true;

        await player.load(dataURL);
        soundCache[storageKey] = { player };
      }

      // started player files
      for (const sound of soundList) {
        const { id, storagePath: storageKey } = sound;

        let mixVolumes = {};
        // Check if there is mixVolumes for each track by user
        if (userMix) {
          mixVolumes = userMix.mixVolumes;
        }

        if (soundCache.hasOwnProperty(storageKey)) {
          const { player } = soundCache[storageKey];

          // Adjust sound volume from user's mixVolumes
          if (mixVolumes.hasOwnProperty(sound.id)) {
            const volume = mixVolumes[sound.id];
            player.volume.value = volume;
          }

          player.start();
          dispatch(
            updateSound({
              id,
              sound: { status: 'started', volume: VOLUME.default },
            })
          );
        }
      }

      dispatch(
        updateMix({
          id: mix.id,
          mix: { status: 'started', volume: VOLUME.default },
        })
      );
    };
    dispatch(getSoundFilesAsync({ sounds: soundList, onSuccess }));
  }
}

const changeMixSoundVolumeDebounce = debounce(
  ({ dispatch, mixId, soundId, userId, volume }) => {
    try {
      dispatch(updateSoundVolume({ id: soundId, volume }));
      dispatch(
        updateUserMixTrackVolumeAsync({
          mixId,
          soundId,
          userId,
          volume,
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export function changeMixSoundVolume({
  dispatch,
  mixId,
  soundId,
  storageKey,
  userId,
  volume,
}) {
  if (soundCache.hasOwnProperty(storageKey)) {
    const { player } = soundCache[storageKey];
    player.volume.value = volume;
  }

  changeMixSoundVolumeDebounce({ dispatch, mixId, soundId, userId, volume });
}
