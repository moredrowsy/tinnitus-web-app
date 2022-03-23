import { configureStore } from '@reduxjs/toolkit';
import { default as postCollections } from './slices/postCollections';
import { default as soundMetadatas } from './slices/soundMetadatas';
import { default as soundFiles } from './slices/soundFiles';

export const store = configureStore({
  reducer: {
    postCollections,
    soundMetadatas,
    soundFiles,
  },
});
