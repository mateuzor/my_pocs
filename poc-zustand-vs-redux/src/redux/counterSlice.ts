import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  count: number;
  clicks: number;
}

const initialState: CounterState = {
  count: 0,
  clicks: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.count++;
      state.clicks++;
    },
    decrement(state) {
      state.count--;
      state.clicks++;
    },
    reset(state) {
      state.count = 0;
      state.clicks = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;

export const incrementAsync = () => (dispatch: any) => {
  setTimeout(() => {
    dispatch(increment());
  }, 500);
};

export default counterSlice.reducer;
