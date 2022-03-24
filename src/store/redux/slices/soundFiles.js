import { createSlice } from '@reduxjs/toolkit';
import { getStorageFile } from '../../firebase/helpers';
import { updateSoundStatus } from '../slices/sounds';

const sliceKey = 'soundFiles';
const initialState = {};

export const soundFilesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addSoundFile: (state, action) => {
      const { storageKey, dataURL } = action.payload;
      if (!(storageKey in state)) {
        state[storageKey] = true;
      }
      return state;
    },
  },
});

export const { addSoundFile } = soundFilesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSoundFiles = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const getSoundFileAsync =
  ({ id, storageKey, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      dispatch(updateSoundStatus({ id, status: 'downloading' }));
      const dataURL = await getStorageFile(storageKey);
      dispatch(addSoundFile({ storageKey, dataURL }));
      dispatch(updateSoundStatus({ id, status: 'complete' }));

      if (onSuccess) onSuccess(dataURL);
    } catch (err) {
      if (onError) onError(err);
    }
  };

export const getSoundFilesAsync =
  ({ sounds, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const datas = [];
      const soundFiles = getState().soundFiles;

      for (const sound of sounds) {
        const { id, storagePath: storageKey } = sound;

        if (!soundFiles.hasOwnProperty(storageKey)) {
          dispatch(updateSoundStatus({ id, status: 'downloading' }));
          const dataURL = await getStorageFile(storageKey);
          datas.push({ id, storageKey, dataURL });
          dispatch(addSoundFile({ storageKey, dataURL }));
          dispatch(updateSoundStatus({ id, status: 'complete' }));
        }
      }

      if (onSuccess) onSuccess(datas);
    } catch (err) {
      if (onError) onError(err);
    }
  };

export default soundFilesSlice.reducer;
