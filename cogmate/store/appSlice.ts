// store/appSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PromptNode = {
  id: string;
  title: string;
  prompt: string;
  children: PromptNode[];
  parent: PromptNode | null;
}

interface AppState {
  tree: PromptNode;
  currentPath: PromptNode[];
  siblings: PromptNode[];
  currentIndex: number;
}

const initialTree: PromptNode = {
  id: 'root',
  title: 'Project Assistant',
  prompt: 'This is the root node of our AI project assistant.',
  children: [],
  parent: null
};

const initialState: AppState = {
  tree: initialTree,
  currentPath: [initialTree],
  siblings: [initialTree],
  currentIndex: 0
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<PromptNode[]>) => {
      state.currentPath = action.payload;
    },
    setSiblings: (state, action: PayloadAction<PromptNode[]>) => {
      state.siblings = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    addNode: (state, action: PayloadAction<{ parentId: string; newNode: PromptNode }>) => {
      const findAndAddNode = (node: PromptNode): void => {
        if (node.id === action.payload.parentId) {
          node.children.push(action.payload.newNode);
        } else {
          node.children.forEach(findAndAddNode);
        }
      };
      findAndAddNode(state.tree);
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      const deleteFromTree = (node: PromptNode): void => {
        node.children = node.children.filter(child => child.id !== action.payload);
        node.children.forEach(deleteFromTree);
      };
      deleteFromTree(state.tree);
    },
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<PromptNode> }>) => {
      const updateInTree = (node: PromptNode): void => {
        if (node.id === action.payload.id) {
          Object.assign(node, action.payload.updates);
        }
        node.children.forEach(updateInTree);
      };
      updateInTree(state.tree);
    }
  }
});

export const {
  setCurrentPath,
  setSiblings,
  setCurrentIndex,
  addNode,
  deleteNode,
  updateNode
} = appSlice.actions;
export default appSlice.reducer;