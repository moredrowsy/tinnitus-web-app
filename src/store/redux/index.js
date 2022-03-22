import { configureStore } from '@reduxjs/toolkit';
import { default as soundMetadatas } from './slices/soundMetadatas';
import { default as soundFiles } from './slices/soundFiles';

export const store = configureStore({
  reducer: {
    soundMetadatas,
    soundFiles,
  },
});
