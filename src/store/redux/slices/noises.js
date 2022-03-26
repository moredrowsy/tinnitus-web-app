import { createSlice } from '@reduxjs/toolkit';

const sliceKey = 'noises';
const initialState = {};

export const noisesSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setNoise: (state, action) => {
      const { noise } = action.payload;
      state[noise.color] = noise;
      return state;
    },
    updateNoiseVolume: (state, action) => {
      const { color, volume } = action.payload;
      state[color] = {
        ...state[color],
        volume,
      };
      return state;
    },
    setNoises: (state, action) => {
      const noises = action.payload;
      for (const { noise } of noises) {
        state[noise.color] = noise;
      }
      return state;
    },
  },
});

export const { setNoise, setNoises, updateNoiseVolume } = noisesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectNoises = (state) => state[sliceKey];

export default noisesSlice.reducer;
