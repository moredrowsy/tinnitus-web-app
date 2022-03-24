import { createSlice } from '@reduxjs/toolkit';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const sliceKey = 'user';
const initialState = {};

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
    updateUserMixes: (state, action) => {
      const { mixIDs } = action.payload;
      state.mixes = [...state.sounds, ...mixIDs];
      return state;
    },
    updateUserSounds: (state, action) => {
      const { soundIDs } = action.payload;
      state.sounds = [...state.sounds, ...soundIDs];
      return state;
    },
  },
});

export const { setUser, updateUser, updateUserMixes, updateUserSounds } =
  usernamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const updateUserMixesAsync =
  ({ mixIDs }) =>
  async (dispatch, getState) => {
    try {
      const { user } = getState();
      updateDoc(doc(db, 'users', user.uid), {
        mixes: arrayUnion(...mixIDs),
      });
      dispatch(updateUserMixes({ mixIDs }));
    } catch (err) {
      console.log(err);
    }
  };

export const updateUserSoundsAsync =
  ({ soundIDs }) =>
  async (dispatch, getState) => {
    try {
      const { user } = getState();
      updateDoc(doc(db, 'users', user.uid), {
        sounds: arrayUnion(...soundIDs),
      });
      dispatch(updateUserSounds({ soundIDs }));
    } catch (err) {
      console.log(err);
    }
  };

export const fetchUserAsync =
  ({ userId }) =>
  async (dispatch, getState) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const { displayName, sounds } = data;
      const reduxUser = { uid: userId, displayName, sounds };

      dispatch(updateUser({ user: reduxUser }));
    } catch (err) {}
  };

export default usernamesSlice.reducer;
