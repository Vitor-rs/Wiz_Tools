import './index.css';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import CalendarPage from './pages/CalendarPage';

const App = () => {
    const [activePage, setActivePage] = useState('calendar');

    return (
        <Layout activePage={activePage} onNavigate={setActivePage}>
            {activePage === 'calendar' ? (
                <CalendarPage />
            ) : (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Content for {activePage}</h2>
                    <p>This is a placeholder for the {activePage} content.</p>
                </div>
            )}
        </Layout>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
