// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './userSlice';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Combine multiple reducers if needed
const rootReducer = combineReducers({
  user: userReducer, 
});

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

// Create a persistor for Redux Persist
export const persistor = persistStore(store);
