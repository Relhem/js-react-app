import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateNode, fetchNodes } from 'api/hierarchyAPI';
import { sortArrayByCriteria } from 'utils/tableUtils';

const initialState = {
    nodes: [],
    nodesCopy: [],
    hasMore: true,
  };

  export const addNewNodesThunk = createAsyncThunk(
    'table/addNewNodesThunk',
    async (params, thunkAPI) => {
      const { offset, limit } = params;

      const nodes = selectNodes(thunkAPI.getState());
      const currentNodes = nodes.slice();
      const nodesResult = await fetchNodes({ params: { offset, limit }});

      const newNodes = nodesResult.data.dbResponse;
      const { allCount } = nodesResult.data;
      if (offset + limit >= allCount) thunkAPI.dispatch(setHasMore({ hasMore: false }));
      console.log('OFFSSS', offset, 'CCC', allCount);

      const newNodesLength = newNodes.length;
      newNodes.forEach((nodeObject) => {
        currentNodes.push(nodeObject);
      });
      thunkAPI.dispatch(setNodes({ nodes: [...currentNodes] }));
      thunkAPI.dispatch(setNodesCopy({ nodes: [...currentNodes] }));
      return { newNodesLength };
    }
  );

  export const handleSaveThunk = createAsyncThunk(
    'table/handleSaveThunk',
    async (params, thunkAPI) => {
      const nodes = selectNodes(thunkAPI.getState());
      const { nodeObject } = params;
        try {
          await updateNode(nodeObject.id, nodeObject);
          thunkAPI.dispatch(setNodesCopy({ nodes }));       
        } catch (error) {
          console.error(error);
        }
    }
  );

  export const revertChangesThunk = createAsyncThunk(
    'table/revertChangesThunk',
    async (params, thunkAPI) => {
      const nodes = selectNodes(thunkAPI.getState());
      const nodesCopy = selectNodesCopy(thunkAPI.getState());

      const { nodeId, nodeIndex } = params;
        try {
          const objectInNodes = nodes.slice(0).filter((nodeObject) => nodeObject.id == nodeId)[0];
          const objectInNodesCopy = nodesCopy.slice(0).filter((nodeObject) => nodeObject.id == nodeId)[0];
          const newObject = Object.assign({}, { ...objectInNodes, IP: objectInNodesCopy.IP, port: objectInNodesCopy.port, name: objectInNodesCopy.name });
          const newNodes = Object.assign([...nodes], { [nodeIndex] : newObject });
          thunkAPI.dispatch(tableSlice.actions.setNodes({ nodes: [...newNodes] }));
        } catch (error) {
          console.error(error);
        }
    }
  );

export const fetchNewNodesThunk = createAsyncThunk(
  'table/fetchInitialNodesThunk',
  async (params, thunkAPI) => {
    const nodes = selectNodes(thunkAPI.getState());
    const { offset, limit, sortBy, sortOrder } = params;
    const fetchResult = await fetchNodes({ params: { offset, limit } });

    const fetchedNodes = fetchResult.data.dbResponse;
    const { allCount } = fetchResult.data;

    const sortedNodes = sortArrayByCriteria({ array: [...nodes, ...fetchedNodes], sortCriteria: sortBy.criteria, isNumber: sortBy.isNumber, sortOrder });
    console.log('##', sortedNodes);
    thunkAPI.dispatch(setNodes({ nodes: [...sortedNodes] }));
    thunkAPI.dispatch(setNodesCopy({ nodes: [...sortedNodes] }));

    if (offset >= allCount) thunkAPI.dispatch(setHasMore({ hasMore: false }));

    const hasMore = selectHasMore(thunkAPI.getState());
    console.log(offset, allCount, hasMore);
    console.log('###', nodes);
    return { hasMore }
  }
);


export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
      setHasMore(state, action) {
        const { hasMore } = action.payload;
        state.hasMore = hasMore;
      },
      purgeNodes(state) {
        state.nodes = [];
        state.nodesCopy = [];
      },
      setNodes: (state, action) => {
        const { nodes } = action.payload;
        state.nodes = nodes;
      },
      setNodesCopy: (state, action) => {
        const { nodes } = action.payload;
        state.nodesCopy = nodes;
      },
    },
  });

export const selectNodes = (state) => state.table.nodes;
export const selectNodesCopy = (state) => state.table.nodesCopy;
export const selectOffset = (state) => state.table.offset;
export const selectHasMore = (state) => state.table.hasMore;

export const { setNodes, setNodesCopy, setOffset, purgeNodes, setHasMore } = tableSlice.actions;

export default tableSlice.reducer;