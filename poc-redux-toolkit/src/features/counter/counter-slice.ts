//DUCKS pattern

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterReducer = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      //it's okay to do this, because immer makes it immutable
      //under the hood.
      state.value++;
    },
    amountAdded(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
  // extraReducers(builder) {
  //const pendingActions = isPending(fetchEditors, fetchPosts);
  //const fullfilledActions = isFullfilled(fetchEditors,fetchPosts);
  //const rejectedActions = isRejected(fetchEditors,fetchPosts);

  //   builder
  //     .addMatcher(pendingActions, (state) => {
  //       state.fetching = true;
  //     })
  //     .addMatcher(fullfilledActions, (state) => {
  //       state.fetching = false;
  //     })
  //     .addMatcher(rejectedActions, (state) => {
  //       state.fetching = false;
  //     });
  // },
});

export const { increment, amountAdded } = counterReducer.actions;
export default counterReducer.reducer;
