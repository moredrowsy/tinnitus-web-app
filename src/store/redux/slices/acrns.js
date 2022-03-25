import { createSlice } from '@reduxjs/toolkit';

const sliceKey = 'acrns';
const initialState = {};

export const noisesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setAcrn: (state, action) => {
      const { type, acrn } = action.payload;
      state[type] = acrn;
      return state;
    },
    setAcrns: (state, action) => {
      const acrns = action.payload;
      for (const { type, acrn } of acrns) {
        state[type] = acrn;
      }
      return state;
    },
  },
});

export const { setAcrn, setAcrns } = noisesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAcrns = (state) => state[sliceKey];

export default noisesSlice.reducer;
