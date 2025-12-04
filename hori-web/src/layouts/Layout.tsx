import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#f5f6fa] overflow-hidden">
            <Sidebar
                activePage={activePage}
                onNavigate={onNavigate}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
                {children}
            </main>
        </div>
    );
};

export default Layout;
