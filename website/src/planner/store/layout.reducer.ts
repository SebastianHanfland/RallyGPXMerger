import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { LayoutState, SidebarSections, State } from './types.ts';
import { storage } from './storage.ts';
import { Sections } from '../layout/types.ts';
import { getInitialLanguage, setLanguage, SupportedLanguages } from '../../language.ts';

const initialState: LayoutState = {
    selectedSection: 'menu',
    hasSingleTrack: false,
    language: getInitialLanguage(),
    isSidebarOpen: true,
    selectedSidebarSection: 'segments',
};

function loadLayoutState() {
    const layoutState = storage.load()?.layout;
    const storedLanguage = layoutState?.language;
    if (storedLanguage) {
        setLanguage(storedLanguage);
    } else {
        setLanguage(getInitialLanguage());
    }
    return layoutState;
}

const layoutSlice = createSlice({
    name: 'layout',
    initialState: loadLayoutState() ?? initialState,
    reducers: {
        selectSection: (state: LayoutState, action: PayloadAction<Sections>) => {
            state.selectedSection = action.payload;
        },
        setLanguage: (state: LayoutState, action: PayloadAction<SupportedLanguages>) => {
            state.language = action.payload;
            setLanguage(action.payload);
        },
        setHasSingleTrack: (state: LayoutState, action: PayloadAction<boolean>) => {
            state.hasSingleTrack = action.payload;
        },
        setIsSidebarOpen: (state: LayoutState, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
        setSelectedSidebarSection: (state: LayoutState, action: PayloadAction<SidebarSections>) => {
            state.selectedSidebarSection = action.payload;
        },
    },
});

export const layoutActions = layoutSlice.actions;
export const layoutReducer: Reducer<LayoutState> = layoutSlice.reducer;
const getBase = (state: State) => state.layout;

export const getSelectionSection = (state: State) => getBase(state).selectedSection;
export const getDisplayLanguage = (state: State) => getBase(state).language;
export const getHasSingleTrack = (state: State) => getBase(state).hasSingleTrack;
export const getIsSidebarOpen = (state: State) => getBase(state).isSidebarOpen;
export const getSelectedSidebarSection = (state: State) => getBase(state).selectedSidebarSection;
