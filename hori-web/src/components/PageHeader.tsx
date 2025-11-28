import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, children, className = '' }) => {
    return (
        <div className={`flex flex-col w-full z-20 bg-white ${className}`}>
            {/* Thin blue line at the top */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400" />

            {/* Main Header Content */}
            <div className="border-b border-gray-200 px-6 py-5 flex justify-between items-start md:items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
                    {subtitle && (
                        <div className="text-sm text-gray-500 font-medium">
                            {subtitle}
                        </div>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Optional Tab/Breadcrumb bar or other content below */}
            {children && (
                <div className="px-6 py-2 border-b border-gray-200 bg-gray-50/50">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
