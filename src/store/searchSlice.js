import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchNodesWhereName } from 'api/searchAPI';

const initialState = {
  searchLine: '',
  foundNodes: {},
  isSearching: false,
};

export const handleFetchWhereAsync = createAsyncThunk(
  'search/handleFetchWhereAsync',
  async (params, thunkAPI) => {
      return fetchNodesWhereName(params).then((fetchResult) => {
        const nodeObjects = fetchResult.data.dbResponse;
        thunkAPI.dispatch(searchSlice.actions.clearFoundNodes());
        thunkAPI.dispatch(searchSlice.actions.setNodes({ nodes: nodeObjects }));
      }).catch((error) => {
        throw error;
      });
  }
);


export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearFoundNodes: (state) => {
      state.foundNodes = {};
    },
    setNodes: (state, action) => {
      const { nodes } = action.payload;
      nodes.forEach((node) => {
        state.foundNodes[node.id] = node;
      });
    },
    setFoundNodeById: (state, action) => {
      const { nodeId, options } = action.payload;
      state.foundNodes[nodeId] = options;
    },
    setIsSearching: (state, action) => {
      const { isSearching } = action.payload;
      state.isSearching = isSearching;
    },
    setSearchLine: (state, action) => {
      const { searchLine } = action.payload;
      state.searchLine = searchLine;
    },
  },
});

export const { setSearchLine, clearFoundNodes, setIsSearching, setFoundNodeById } = searchSlice.actions;


export const selectSearchLine = (state) => state.search.searchLine;
export const selectFoundNodes = (state) => state.search.foundNodes;
export const selectIsSearching = (state) => state.search.isSearching;

export default searchSlice.reducer;
