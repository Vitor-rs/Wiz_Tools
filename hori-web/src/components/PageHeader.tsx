import React from 'react';

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, children, className = '' }) => {
    return (
        <div className={`flex flex-col w-full z-20 bg-white ${className}`}>


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
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(to_left,#2a5298,#1e3c72)]" />
                    <div className="px-6 py-2 border-b border-gray-200 bg-gray-50/50">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageHeader;
