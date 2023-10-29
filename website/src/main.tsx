import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AppFooter } from './Footer.tsx';
import { AppHeader } from './Header.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <AppHeader />
                <App />
                <AppFooter />
            </Provider>
        </ErrorBoundary>
    </React.StrictMode>
);
