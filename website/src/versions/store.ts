import { configureStore } from '@reduxjs/toolkit';
import { iFrameReducer } from '../store/reducers.ts';

const createIframeStore = () =>
    configureStore({
        reducer: iFrameReducer,
    });
export const iframeStore = createIframeStore();
