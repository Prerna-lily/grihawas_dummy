// index.js (or wherever you render your App component)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // OR HashRouter
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter> {/* OR HashRouter */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);