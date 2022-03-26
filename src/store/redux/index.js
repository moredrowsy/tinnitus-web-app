import { configureStore } from '@reduxjs/toolkit';
import { default as acrns } from './slices/acrns';
import { default as mixes } from './slices/mixes';
import { default as noises } from './slices/noises';
import { default as postCollections } from './slices/postCollections';
import { default as sounds } from './slices/sounds';
import { default as soundFiles } from './slices/soundFiles';
import { default as user } from './slices/user';
import { default as usernames } from './slices/usernames';

export const store = configureStore({
  reducer: {
    acrns,
    mixes,
    noises,
    postCollections,
    sounds,
    soundFiles,
    user,
    usernames,
  },
});
