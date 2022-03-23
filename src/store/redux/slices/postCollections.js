import { createSlice } from '@reduxjs/toolkit';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const sliceKey = 'postCollections';
const initialState = {};

// NOTE
// Post key is based on mix/sounds id

export const postCollectionsSlice = createSlice({
  name: sliceKey,
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addPost: (state, action) => {
      const { collectionId, post } = action.payload;
      const { id: postId } = post;

      if (!(collectionId in state)) {
        state[collectionId] = { [postId]: post };
      } else if (!(postId in state[collectionId])) {
        state[collectionId] = { ...state[collectionId], [postId]: post };
      } else {
        state[collectionId][postId] = post;
      }

      return state;
    },
    addPosts: (state, action) => {
      const { collectionId, postCollections } = action.payload;
      state[collectionId] = postCollections;
      return state;
    },
  },
});

export const { addPost, addPosts, updatePosts } = postCollectionsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectPostCollections = (state) => state[sliceKey];

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const addPostAsync =
  ({ collectionId, path, post, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const postRef = collection(db, path, collectionId, 'posts');
      const docRef = await addDoc(postRef, post);
      post.id = docRef.id;
      dispatch(addPost({ collectionId, post }));

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
      console.log({ err });
    }
  };

export const fetchPostsByCollectionIdAsync =
  ({ collectionId, path, onSuccess, onError }) =>
  async (dispatch, getState) => {
    try {
      const postRef = collection(db, path, collectionId, 'posts');
      const querySnapshot = await getDocs(postRef);
      const postCollections = {};
      querySnapshot.forEach((q) => {
        const data = q.data();
        const { authorId, body, timestamp } = data;
        postCollections[q.id] = {
          authorId,
          body,
          timestamp,
        };
      });

      dispatch(addPosts({ collectionId, postCollections }));

      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
  };

export default postCollectionsSlice.reducer;
