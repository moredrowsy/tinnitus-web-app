import { createSlice } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { debounce } from '../../../utils';
import { DEBOUNCE_WAIT } from '../../../constants';

const sliceKey = 'user';
const initialState = {
  displayName: '',
  sounds: {},
  mixes: {},
  noises: {},
};

export const usernamesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: (state, action) => {
      const { user } = action.payload;
      return user;
    },
    updateUser: (state, action) => {
      const { user } = action.payload;
      state = { ...state, ...user };
      return state;
    },

    updateUserSoundVote: (state, action) => {
      const { soundId, vote } = action.payload;
      state.sounds[soundId].vote = vote;
      return state;
    },
    updateUserSoundVolume: (state, action) => {
      const { soundId, volume } = action.payload;
      state.sounds[soundId].volume = volume;
      return state;
    },
    updateUserMixVote: (state, action) => {
      const { mixId, vote } = action.payload;
      state.mixes[mixId].vote = vote;
      return state;
    },
    updateUserMixVolume: (state, action) => {
      const { mixId, soundId, volume } = action.payload;
      state.mixes[mixId].mixVolumes[soundId] = volume;
      return state;
    },
    updateUserSound: (state, action) => {
      const { soundId, userSound } = action.payload;
      if (state.sounds.hasOwnProperty(soundId)) {
        state.sounds[soundId] = { ...state.sounds[soundId], ...userSound };
      } else {
        state.sounds[soundId] = userSound;
      }
      return state;
    },
    updateUserMix: (state, action) => {
      const { mixId, userMix } = action.payload;
      if (state.mixes.hasOwnProperty(mixId)) {
        state.mixes[mixId] = { ...state.mixes[mixId], ...userMix };
      } else {
        state.mixes[mixId] = userMix;
      }
      return state;
    },
  },
});

export const {
  setUser,
  updateUser,
  updateUserMix,
  updateUserMixVolume,
  updateUserSound,
  updateUserSoundVolume,
  updateUserSoundVote,
  updateUserMixVote,
} = usernamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const updateUserMixesAsync =
  ({ userId, mixId, userMix }) =>
  async (dispatch, getState) => {
    try {
      const postRef = doc(db, 'users', userId, 'mixes', mixId);
      setDoc(postRef, userMix);
      dispatch(updateUserMix({ userId, mixId, userMix }));
    } catch (err) {
      console.log(err);
    }
  };

export const updateUserSoundsAsync =
  ({ userId, soundId, userSound }) =>
  async (dispatch, getState) => {
    try {
      const postRef = doc(db, 'users', userId, 'sounds', soundId);
      setDoc(postRef, userSound);
      dispatch(updateUserSound({ soundId, userSound }));
    } catch (err) {
      console.log(err);
    }
  };

export const updateUserSoundVoteAsync =
  ({ userId, soundId, vote, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId) {
        const postRef = doc(db, 'users', userId, 'sounds', soundId);
        updateDoc(postRef, { vote });

        dispatch(updateUserSoundVote({ soundId, vote }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const updateUserMixVoteAsync =
  ({ userId, mixId, vote, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId) {
        const postRef = doc(db, 'users', userId, 'mixes', mixId);
        updateDoc(postRef, { vote });

        dispatch(updateUserMixVote({ mixId, vote }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

const updateSoundVolumeAsyncDebounce = debounce(
  ({ userId, soundId, volume, dispatch }) => {
    try {
      const postRef = doc(db, 'users', userId, 'sounds', soundId);
      updateDoc(postRef, { volume });
      dispatch(updateUserSoundVolume({ soundId, volume }));
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export const updateUserSoundVolumeAsync =
  ({ userId, soundId, volume, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId) {
        updateSoundVolumeAsyncDebounce({ userId, soundId, volume, dispatch });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

const updateMixVolumeAsyncDebounce = debounce(
  ({ userId, mixId, soundId, mixVolumes, volume, dispatch }) => {
    try {
      mixVolumes[soundId] = volume;
      const postRef = doc(db, 'users', userId, 'mixes', mixId);
      updateDoc(postRef, { mixVolumes });
      dispatch(updateUserMixVolume({ mixId, soundId, volume }));
    } catch (e) {
      console.log(e);
    }
  },
  DEBOUNCE_WAIT
);

export const updateUserMixTrackVolumeAsync =
  ({ userId, mixId, soundId, volume, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId) {
        const mixVolumes = getState().user.mixes[mixId].mixVolumes;
        updateMixVolumeAsyncDebounce({
          userId,
          mixId,
          soundId,
          mixVolumes: { ...mixVolumes },
          volume,
          dispatch,
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const fetchUserAsync =
  ({ userId }) =>
  async (dispatch, getState) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      const { displayName } = data;

      const soundsRef = collection(db, 'users', userId, 'sounds');
      const soundsSnapshot = await getDocs(soundsRef);
      const sounds = {};
      soundsSnapshot.forEach((q) => {
        const data = q.data();
        sounds[q.id] = data;
      });

      const mixesRef = collection(db, 'users', userId, 'mixes');
      const mixesSnapshot = await getDocs(mixesRef);
      const mixes = {};
      mixesSnapshot.forEach((q) => {
        const data = q.data();
        mixes[q.id] = data;
      });

      const reduxUser = {
        uid: userId,
        displayName,
        sounds,
        mixes,
      };

      dispatch(updateUser({ user: reduxUser }));
    } catch (err) {}
  };

export default usernamesSlice.reducer;
