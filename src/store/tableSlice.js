import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateNode, fetchNodes } from 'api/hierarchyAPI';

const initialState = {
    nodes: [],
    nodesCopy: [],
  };

  export const addNewNodesThunk = createAsyncThunk(
    'table/addNewNodesThunk',
    async (params, thunkAPI) => {
      const { offset, limit } = params;

      const nodes = selectNodes(thunkAPI.getState());
      const currentNodes = nodes.slice();
      const nodesResult = await fetchNodes({ params: { offset, limit }});
      const newNodes = nodesResult.data;
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

export const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
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

export const { setNodes, setNodesCopy } = tableSlice.actions;

export default tableSlice.reducer;