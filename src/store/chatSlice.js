import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  users: [],
  username: '',
  isAuthenticated: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { messageObject } = action.payload;
      state.messages.push(messageObject);
    },
    setUsers: (state, action) => {
      const { users } = action.payload;
      state.users = users;
    },
    setUsername: (state, action) => {
      const { username } = action.payload;
      state.username = username;
    },
    setIsAuthenticated: (state, action) => {
      const { isAuthenticated } = action.payload;
      state.isAuthenticated = isAuthenticated;
    },
  },
});

export const { addMessage, setUsername, setIsAuthenticated, setUsers } = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;
export const selectUsers = (state) => state.chat.users;
export const selectIsAuthenticated = (state) => state.chat.isAuthenticated;
export const selectUsername = (state) => state.chat.username;

export default chatSlice.reducer;
