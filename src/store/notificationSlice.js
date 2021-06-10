import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: 'none',
  usedClass: '',
  notification: {
    isVisible: false,
    text: '',
    usedClasses: '',
  },
};

export const showNotification = createAsyncThunk(
  'notification/showNotification',
  async (params, thunkAPI) => {
    const { text } = params;
    const delay = params.delay ?? 2000;
    const usedClasses = params.usedClasses ?? '';
    const notificationIsVisible = selectNotificationVisibility(thunkAPI.getState());
    if (!notificationIsVisible) {
      thunkAPI.dispatch(notificationSlice.actions.setNotificationText({ text }));
      thunkAPI.dispatch(notificationSlice.actions.setNotificationUsedClasses({ usedClasses }));
      thunkAPI.dispatch(notificationSlice.actions.setNotificationVisibility({ visibility: true }));
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('done');
        }, delay);
      });
      thunkAPI.dispatch(notificationSlice.actions.setNotificationVisibility({ visibility: false }));
      return 'success';
    } else {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('done');
        }, 1000);
      });
      thunkAPI.dispatch(showNotification({ text, usedClasses, delay }));
      return 'fail';
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationUsedClasses: (state, action) => {
      const { usedClasses } = action.payload;
      state.notification.usedClasses = usedClasses;
    },
    setNotificationText: (state, action) => {
      const { text } = action.payload;
      state.notification.text = text;
    },
    setText: (state, action) => {
      const { text, usedClass } = action.payload;
      state.text = text;
      state.usedClass = usedClass;
    },
    setNotificationVisibility: (state, action) => {
      const { visibility } = action.payload;
      state.notification.isVisible = visibility;
    }, 
  },
});

export const { setText } = notificationSlice.actions;


export const selectNotificationText = (state) => state.notification.notification.text;
export const selectNotificationVisibility = (state) => state.notification.notification.isVisible;
export const selectNotificationUsedClasses = (state) => state.notification.notification.usedClasses;

export const selectText = (state) => state.notification.text;
export const usedClass = (state) => state.notification.usedClass;

export default notificationSlice.reducer;
