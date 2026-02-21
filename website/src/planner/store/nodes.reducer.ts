import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NodeEditInfo, NodeSpecification, NodesState, State } from './types.ts';
import { storage } from './storage.ts';

const initialState: NodesState = {
    nodeEditInfo: undefined,
    nodeSpecifications: {},
};

const nodesSlice = createSlice({
    name: 'nodes',
    initialState: storage.load()?.nodes ?? initialState,
    reducers: {
        setNodeEditInfo: (state: NodesState, action: PayloadAction<NodeEditInfo | undefined>) => {
            state.nodeEditInfo = action.payload;
        },
        setNodeSpecification: (
            state: NodesState,
            action: PayloadAction<{ segmentAfter?: string; nodeSpecs?: NodeSpecification }>
        ) => {
            const { segmentAfter, nodeSpecs } = action.payload;
            if (segmentAfter) {
                state.nodeSpecifications = { ...(state.nodeSpecifications ?? {}), [segmentAfter]: nodeSpecs };
            }
        },
        clear: () => initialState,
    },
});

export const nodesActions = nodesSlice.actions;
export const nodesReducer: Reducer<NodesState> = nodesSlice.reducer;
const getBase = (state: State) => state.nodes;

export const getNodeEditInfo = (state: State) => getBase(state).nodeEditInfo;
export const getNodeSpecifications = (state: State) => getBase(state).nodeSpecifications;
