import React from 'react';

interface HeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, actions, children, className = '' }) => {
    return (
        <div className={`flex flex-col w-full z-20 bg-white ${className}`}>


            {/* Main Header Content */}
            <div className="relative border-b border-gray-200 px-6 py-5 flex justify-between items-start md:items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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

                {/* Gradient Border Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(to_left,#2a5298,#1e3c72)]" />
            </div>

            {/* Optional Tab/Breadcrumb bar or other content below */}
            {children && (
                <div className="relative">
                    <div className="px-6 py-2 border-b border-gray-200 bg-gray-50/50">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
