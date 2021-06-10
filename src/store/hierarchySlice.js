import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as hierarchyAPI from 'api/hierarchyAPI';

import { updateNode, createNode, fetchChildrenForId, deleteNode as deleteNodeInApi } from 'api/hierarchyAPI'

const initialState = {
  nodes: {},
  activeTasks: {
    fetchingNullNodes: false,
    fetchingChildren: false,
  },
  selectedNode: null,
};

export const selectBuiltTree = (state) => {
  const { nodes } = state.hierarchy;
  const tree = {};
  Object.keys(nodes).forEach((nodeIndex) => {
    const nodeObject = nodes[nodeIndex];
    const { parentId } = nodeObject;
    if (parentId) {
      if (tree[parentId]) {
        tree[parentId].push(nodeObject.id);
      } else {
        tree[parentId] = [nodeObject.id];
      }
    }
  });
  return tree;
}

export const selectNodes = (state) => state.hierarchy.nodes;
export const selectState = (state) => state.hierarchy.status;
export const selectSelectedId = (state) => state.hierarchy.selectedNode;
export const selectActiveTasks = (state) => {
  const { activeTasks } = state.hierarchy;
  const atLeastOneIsActive = Object.keys(activeTasks).filter((taskName) => {
    const taskObject = activeTasks[taskName];
    return taskObject;
  }).length > 0;
  return {
    activeTasks, atLeastOneIsActive
  };
}

export const fetchInitialNodesAsync = createAsyncThunk(
    'hierarchy/fetchInitialNodesAsync',
    async (_, thunkAPI) => {
      try {
        const fetchResult = await hierarchyAPI.fetchNullNodes();
        let fetchedNodes = fetchResult.data;
        const fetchChildrenPromises = fetchedNodes.map((nodeObject) => {
          return hierarchyAPI.fetchChildrenForId(nodeObject.id);
        });

        const foundChildren = [];
        const initialHierarchy = {};

        await Promise.all(fetchChildrenPromises).then((fetchChildrenResult) => {
          for (let i = 0; i < fetchedNodes.length; i += 1) {
            foundChildren.push(...fetchChildrenResult[i].data);
          }
          thunkAPI.dispatch(hierarchySlice.actions.setNodes({ nodes: [...fetchedNodes, ...foundChildren] }));
        });
        return { fetchedNodes, fetchedChildren: foundChildren, initialHierarchy };
      } catch (error) {
        throw error;
      }
    }
);

export const handleFetchChildrenForIdAsync = createAsyncThunk(
  'hierarchy/handleFetchChildrenForIdAsync',
  async (params, thunkAPI) => {
      try {
        const { id } = params;
        const handleFetchChildrenForId = async (id) => {
          const fetchResult = await hierarchyAPI.fetchChildrenForId(id);
          const fetchedNewNodes = fetchResult.data;
          const fetchChildrenPromises = fetchedNewNodes.map((nodeObject) => {
            return hierarchyAPI.fetchChildrenForId(nodeObject.id);
          });
          const foundChildren = [];
          const fetchChildrenResult = await Promise.all(fetchChildrenPromises);
          for (let i = 0; i < fetchedNewNodes.length; i += 1) {
            foundChildren.push(...fetchChildrenResult[i].data);
          }
          thunkAPI.dispatch(setNodes({ nodes: [...fetchedNewNodes, ...foundChildren] }));
          return { fetchedNewNodes, fetchedChildren: foundChildren }
        };
        const fetchResult = await handleFetchChildrenForId(id);
        return fetchResult;
    } catch (error) {
        throw error;
    }
  }
);

export const handleUpdateAsync = createAsyncThunk(
  'hierarchy/handleUpdateAsync',
  async (params, thunkAPI) => { 
      const selectedId = selectSelectedId(thunkAPI.getState());

      const { nodeName, ip, port } = params;

      const options = { 
        name: nodeName,
        IP: ip,
        port,
      };

      try { 
        await updateNode(selectedId, options);
        thunkAPI.dispatch(setNodeById({ nodeId: selectedId, options }));
      } catch (error) {
        throw error;
      }
  }
);

export const handleCreateAsync = createAsyncThunk(
'hierarchy/handleCreateAsync',
async (params, thunkAPI) => { 
    const selectedId = selectSelectedId(thunkAPI.getState());
    const { nodeCreator } = params;
    const options = Object.assign({}, nodeCreator.object);
    options.parentId = selectedId;
    return createNode(selectedId, options).then((createResult) => {
      const createdNode = createResult.data.message;
      thunkAPI.dispatch(setNodeById({ nodeId: createdNode.id, options: createdNode }));
    }).catch((error) => {
      throw error;
    });
}
);

export const handleDeleteAsync = createAsyncThunk(
'hierarchy/handleDeleteAsync',
async (params, thunkAPI) => {

    const { selectedId } = params;

    const tree = Object.assign({}, selectBuiltTree(thunkAPI.getState()));

    const findChildren = (children, found) => {
      return new Promise((resolve, reject) => {
        if (!children || children.length == 0) resolve(found);
        else {
          found.push(...children);
          const childrenPromises = (children) => children.map((nodeId) => {
            return fetchChildrenForId(nodeId);
          });
          Promise.all(childrenPromises(children)).then((result) => {
            const arraysOfChildren = result.map(childObject => childObject.data);
            const childrenIds = [];
            arraysOfChildren.forEach((childrenArray) => {
              childrenArray.forEach((childObject) => {
                childrenIds.push(childObject.id);
              });
            });
            resolve(findChildren(childrenIds, found));
          }).catch((error) => {
            reject(error);
          });
        }
      });
  };
  const children = tree[selectedId];
  const allChildren = await findChildren(children, []);
  const nodesToDelete = [selectedId, ...allChildren];
 
  const deletePromises = nodesToDelete.map((nodeId) => {
    return deleteNodeInApi(nodeId);
  });

  try {
    const allPromises = Promise.all(deletePromises).then(() => {
      thunkAPI.dispatch(hierarchySlice.actions.deleteNode({ nodeId: selectedId }));
      thunkAPI.dispatch(setSelectedNode({ nodeId: null }));
    });
    await allPromises;
    return { nodesToDelete };
  } catch (error) {
    return { nodesToDelete: [] };
  }
}
);

export const hierarchySlice = createSlice({
    name: 'hierarchy',
    initialState,
    reducers: {
      setNodes: (state, action) => {
        const { nodes } = action.payload;
        nodes.forEach((node) => {
          state.nodes[node.id] = node;
        });
      },
      setNodeById: (state, action) => {
        const { nodeId, options } = action.payload;
        const currentOptions = state.nodes[nodeId];
        state.nodes[nodeId] = { ...currentOptions, ...options };
      },
      setSelectedNode: (state, action) => {
        const { nodeId } = action.payload;
        state.selectedNode = nodeId;
      },
      deleteNode: (state, action) => {
        const { nodeId } = action.payload;
        delete state.nodes[nodeId];
        state.nodes = {...state.nodes};
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchInitialNodesAsync.pending, (state) => {
          state.activeTasks.fetchingNullNodes = true;
        })
        .addCase(fetchInitialNodesAsync.fulfilled, (state, action) => {
          state.activeTasks.fetchingNullNodes = false;
        });
    },
  });

  export const { setNodes,
    toggleOpen,
    setSelectedNode,
    setIsOpen,
    deleteNode,
    setNodeById,
    addChildToNodeById,
  } = hierarchySlice.actions;

  export default hierarchySlice.reducer;