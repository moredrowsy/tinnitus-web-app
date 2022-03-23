import { configureStore } from '@reduxjs/toolkit';
import { default as postCollections } from './slices/postCollections';
import { default as sounds } from './slices/sounds';
import { default as soundFiles } from './slices/soundFiles';
import { default as usernames } from './slices/usernames';
import { default as userVotes } from './slices/userVotes';

export const store = configureStore({
  reducer: {
    postCollections,
    sounds,
    soundFiles,
    usernames,
    userVotes,
  },
});
