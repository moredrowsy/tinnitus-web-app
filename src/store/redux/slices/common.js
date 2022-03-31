import { createSlice } from '@reduxjs/toolkit';
import { fetchMixesAsync } from './mixes';
import { fetchPostsByCollectionIdAsync } from './postCollections';
import { fetchSoundsAsync } from './sounds';
import { fetchUserAsync } from './user';
import { fetchUsernamesAsync } from './usernames';

const sliceKey = 'common';
const initialState = null;

export const usernamesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // No internal state. Just a placeholder for common redux actions
  },
});

export const {} = usernamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsernames = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const refreshReduxAsync = (options) => async (dispatch, getState) => {
  try {
    const state = getState();
    dispatch(fetchUsernamesAsync());
    dispatch(fetchSoundsAsync());
    dispatch(fetchMixesAsync());

    // If there's a user, refresh user data
    const { user } = state;
    if (user.uid) dispatch(fetchUserAsync({ userId: user.uid }));

    // If there's a post info, refresh post data for that post collection only

    if (options) {
      const { post } = options;
      if (post) {
        const { collectionId, path } = post;
        dispatch(fetchPostsByCollectionIdAsync({ collectionId, path }));
      }
    }
  } catch (err) {}
};

export default usernamesSlice.reducer;
