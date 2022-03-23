import { createSlice } from '@reduxjs/toolkit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const sliceKey = 'usernames';
const initialState = {};

export const usernamesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addUsername: (state, action) => {
      const { id, username } = action.payload;
      state[id] = username;
      return state;
    },
    addUsernames: (state, action) => {
      const { usernames } = action.payload;
      state = { ...state, ...usernames };
      return state;
    },
  },
});

export const { addUsername, addUsernames } = usernamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUsernames = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const getUsernameByIdAsync =
  ({ id, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const usernames = getState().usernames;

      if (!(id in usernames)) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          dispatch(addUsername({ id, username: docSnap.data().displayName }));
        }
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
  };

export const fetchUsernamesAsync = () => async (dispatch, getState) => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const usernames = {};
    querySnapshot.forEach((q) => {
      const data = q.data();
      const { displayName } = data;
      usernames[q.id] = displayName;
    });

    dispatch(addUsernames({ usernames }));
  } catch (err) {}
};

export default usernamesSlice.reducer;
