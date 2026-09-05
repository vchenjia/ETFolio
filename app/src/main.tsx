import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import { BrowserRouter } from 'react-router';


createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
