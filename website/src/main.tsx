import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { App } from './App.tsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
