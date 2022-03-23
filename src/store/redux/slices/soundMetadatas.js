import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import {
  collection,
  doc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { updateUserVote } from './userVotes';

const sliceKey = 'soundMetadatas';
const initialState = {};

export const soundMetadatasSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateSoundMetadatas: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    updateSoundMetadataStatus: (state, action) => {
      const { id, status } = action.payload;
      state[id] = {
        ...state[id],
        status,
      };
      return state;
    },
    incrementSoundMetadataVote: (state, action) => {
      const { id } = action.payload;
      state[id] = {
        ...state[id],
        votes: Number(state[id].votes) + 1,
      };
      return state;
    },
    decrementSoundMetadataVote: (state, action) => {
      const { id } = action.payload;
      state[id] = {
        ...state[id],
        votes: Number(state[id].votes) - 1,
      };
      return state;
    },
  },
});

export const {
  decrementSoundMetadataVote,
  incrementSoundMetadataVote,
  updateSoundMetadatas,
  updateSoundMetadataStatus,
} = soundMetadatasSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMetadata = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const updateSoundMetadatasAsync = () => async (dispatch, getState) => {
  const querySnapshot = await getDocs(collection(db, 'sounds'));

  // Serialize snapshot documents to json object for redux
  const temp = {};
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const { authorId, filename, storagePath, title, tags, timestamp, votes } =
      data;
    temp[doc.id] = {
      id: doc.id,
      authorId,
      filename,
      storagePath,
      tags,
      title,
      timestamp: timestamp.seconds,
      votes,
      status: 'none',
    };
  });

  dispatch(updateSoundMetadatas(temp));
};

export const incrementSoundMetadataVoteAsync =
  ({ id, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const soundRef = doc(db, 'sounds', id);
      updateDoc(soundRef, {
        votes: increment(1),
      });
      dispatch(incrementSoundMetadataVote({ id }));
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const decrementSoundMetadataVoteAsync =
  ({ id, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const soundRef = doc(db, 'sounds', id);
      updateDoc(soundRef, {
        votes: increment(-1),
      });
      dispatch(decrementSoundMetadataVote({ id }));
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const addVoteAsync =
  ({ userId, postId, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId && postId) {
        const postRef = doc(db, 'users', userId, 'votes', postId);
        setDoc(postRef, { count: 1 });
        dispatch(updateUserVote({ postId, voteInfo: { count: 1 } }));
        dispatch(incrementSoundMetadataVoteAsync({ id: postId }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const decrementVoteAynsc =
  ({ userId, postId, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId && postId) {
        const postRef = doc(db, 'users', userId, 'votes', postId);
        setDoc(postRef, { count: -1 });
        dispatch(updateUserVote({ postId, voteInfo: { count: -1 } }));
        dispatch(decrementSoundMetadataVoteAsync({ id: postId }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const incrementVoteAynsc =
  ({ userId, postId, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId && postId) {
        const postRef = doc(db, 'users', userId, 'votes', postId);
        setDoc(postRef, { count: 1 });
        dispatch(updateUserVote({ postId, voteInfo: { count: 1 } }));
        dispatch(incrementSoundMetadataVoteAsync({ id: postId }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export default soundMetadatasSlice.reducer;
