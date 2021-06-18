import { configureStore } from '@reduxjs/toolkit';
import counterReducer from 'features/counter/counterSlice';
import hierarchyReducer from 'store/hierarchySlice';
import notificationReducer from 'store/notificationSlice';
import searchSliceReducer from './searchSlice';
import tableSliceReducer from './tableSlice';
import chatSliceReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    hierarchy: hierarchyReducer,
    notification: notificationReducer,
    search: searchSliceReducer,
    table: tableSliceReducer,
    chat: chatSliceReducer,
  },
});
