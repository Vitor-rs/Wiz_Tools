import React from 'react';

interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col h-full bg-[#f5f6fa] ${className}`}>
            {children}
        </div>
    );
};

export default PageContainer;
