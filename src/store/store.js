import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'features/counter/counterSlice';
import hierarchyReducer from 'store/hierarchySlice';
import notificationReducer from 'store/notificationSlice';
import searchSliceReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    hierarchy: hierarchyReducer,
    notification: notificationReducer,
    search: searchSliceReducer,
  },
});
