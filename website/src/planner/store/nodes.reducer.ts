import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { NodeEditInfo, NodeSpecification, NodesState, State } from './types.ts';
import { storage } from './storage.ts';

const initialState: NodesState = {
    nodeEditInfo: undefined,
    nodeSpecifications: {},
    nodeStreetNames: {},
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
        setNodeStreetName: (
            state: NodesState,
            action: PayloadAction<{ segmentAfter: string; streetName: string | undefined }>
        ) => {
            if (action.payload.streetName === undefined) {
                delete state.nodeStreetNames?.[action.payload.segmentAfter];
            } else {
                state.nodeStreetNames = {
                    ...(state.nodeStreetNames ?? {}),
                    [action.payload.segmentAfter]: action.payload.streetName,
                };
            }
        },
        clear: () => initialState,
    },
});

export const nodesActions = nodesSlice.actions;
export const nodesReducer: Reducer<NodesState> = nodesSlice.reducer;
const getBase = (state: State) => state.nodes;

export const getNodeEditInfo = (state: State) => getBase(state).nodeEditInfo;
const defaultNodeSpecification: Record<string, NodeSpecification> = {};
export const getNodeSpecifications = (state: State) => getBase(state).nodeSpecifications ?? defaultNodeSpecification;
const defaultNodeStreetNames: Record<string, string | undefined> = {};
export const getNodeStreetNames = (state: State) => getBase(state).nodeStreetNames ?? defaultNodeStreetNames;
