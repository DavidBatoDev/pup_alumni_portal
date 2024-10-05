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
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

// Export the actions and the reducer
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
