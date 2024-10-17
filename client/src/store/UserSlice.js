// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

// Export the actions and the reducer
export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
