import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  },
});

export const { updateSoundMetadatas, updateSoundMetadataStatus } =
  soundMetadatasSlice.actions;

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

export default soundMetadatasSlice.reducer;
