import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">Hello from React + Electron + Tailwind!</h1>
        </div>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
