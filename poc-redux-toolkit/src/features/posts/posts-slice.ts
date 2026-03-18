import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// createAsyncThunk generates three action types automatically:
// posts/fetchAll/pending, posts/fetchAll/fulfilled, posts/fetchAll/rejected
export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], status: 'idle', error: null } as PostsState,
  reducers: {},
  // extraReducers handles actions from outside the slice (like async thunks)
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // payload is the resolved value of the thunk
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default postsSlice.reducer;
export const selectPosts = (state: { posts: PostsState }) => state.posts;
