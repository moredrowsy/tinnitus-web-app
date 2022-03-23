import { createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const sliceKey = 'userVotes';
const initialState = {};

export const userVotesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateUserVote: (state, action) => {
      const { postId, voteInfo } = action.payload;
      state[postId] = voteInfo;
      return state;
    },
    fetchUserVotes: (state, action) => {
      const { userVotes } = action.payload;
      state = userVotes;
      return state;
    },
  },
});

export const { fetchUserVotes, updateUserVote } = userVotesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUserVotes = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export const fetchUserVotesAsync =
  ({ userId, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      if (userId) {
        const usersRef = collection(db, 'users', userId, 'votes');
        const querySnapshot = await getDocs(usersRef);

        const userVotes = {};
        querySnapshot.forEach((q) => {
          const data = q.data();
          userVotes[q.id] = data;
        });

        dispatch(fetchUserVotes({ userVotes }));
      } else {
        dispatch(fetchUserVotes({ userVotes: {} }));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export default userVotesSlice.reducer;
