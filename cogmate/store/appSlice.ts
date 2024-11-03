import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Define your initial state here
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { /* export your actions here */ } = appSlice.actions;
export default appSlice.reducer;
