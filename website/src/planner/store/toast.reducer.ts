import { createSlice, Dispatch, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, Toast, ToastsState } from './types.ts';
import { v4 as uuidv4 } from 'uuid';

const initialState: ToastsState = {
    toasts: [],
};

type ToastInfo = { title: string; message?: string };
const toastsSlice = createSlice({
    name: 'toasts',
    initialState: initialState,
    reducers: {
        addToast: (state: ToastsState, action: PayloadAction<Toast>) => {
            state.toasts = [...state.toasts, action.payload];
        },
        closeToast: (state: ToastsState, action: PayloadAction<string>) => {
            state.toasts = state.toasts?.filter((toast) => toast.id !== action.payload);
        },
        clearToasts: (state: ToastsState) => {
            state.toasts = [];
        },
    },
});

function addToast(dispatch: Dispatch, toastInfo: ToastInfo, type: 'success' | 'danger') {
    const toast: Toast = {
        id: uuidv4(),
        title: toastInfo.title,
        message: toastInfo.message,
        type: type,
    };
    dispatch(toastsSlice.actions.addToast(toast));
    setTimeout(() => {
        dispatch(toastsSlice.actions.closeToast(toast.id));
    }, 5000);
}

export const successNotification = (dispatch: Dispatch, title: string, message?: string) => {
    addToast(dispatch, { title, message }, 'success');
};

export const errorNotification = (dispatch: Dispatch, title: string, message?: string) => {
    addToast(dispatch, { title, message }, 'danger');
};

export const toastsActions = toastsSlice.actions;
export const toastsReducer: Reducer<ToastsState> = toastsSlice.reducer;
const getBase = (state: State) => state.toasts;

export const getToasts = (state: State) => getBase(state).toasts;