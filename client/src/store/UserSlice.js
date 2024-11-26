// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  notifications: [],
  userLoading: false
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
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    setLoading: (state, action) => {
      state.userLoading = action.payload;
    },
  },
});

// Export the actions and the reducer
export const { login, logout, updateUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
