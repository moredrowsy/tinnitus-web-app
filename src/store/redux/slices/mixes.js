import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { updateUserMixesAsync } from './user';
import { updateUserVoteAsync } from './userVotes';

const sliceKey = 'mixes';
const initialState = {};

export const mixesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addMix: (state, action) => {
      const { mix } = action.payload;
      const { id } = mix;
      state[id] = mix;
      return state;
    },
    updateMixes: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    updateMixStatus: (state, action) => {
      const { id, status } = action.payload;
      state[id] = {
        ...state[id],
        status,
      };
      return state;
    },
    incrementMixVote: (state, action) => {
      const { id } = action.payload;
      state[id] = {
        ...state[id],
        votes: Number(state[id].votes) + 1,
      };
      return state;
    },
    decrementMixVote: (state, action) => {
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
  addMix,
  decrementMixVote,
  incrementMixVote,
  updateMixes,
  updateMixStatus,
} = mixesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMixes = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const updateMixesAsync = () => async (dispatch, getState) => {
  const querySnapshot = await getDocs(collection(db, 'mixes'));
  // Serialize snapshot documents to json object for redux
  const temp = {};
  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const { authorId, soundIDs, title, timestamp, votes } = data;
    const mix = {
      id: doc.id,
      authorId,
      soundIDs, // array of sound ids
      title,
      timestamp,
      votes,
      status: 'none',
    };
    temp[doc.id] = mix;
  });
  dispatch(updateMixes(temp));
};

export const addMixAsync =
  ({ userId, mix, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const docRef = await addDoc(collection(db, 'mixes'), mix);
      mix.id = docRef.id;
      dispatch(addMix({ mix }));
      dispatch(updateUserMixesAsync({ mixIDs: [docRef.id] }));

      const voteInfo = { count: 1 };
      dispatch(updateUserVoteAsync({ userId, postId: docRef.id, voteInfo }));

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export default mixesSlice.reducer;
