import React, { useState } from "react";
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    CheckSquare,
    Layers,
    ChevronDown,
} from "lucide-react";

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    subItems?: { id: string; label: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({
    activePage,
    onNavigate,
    isCollapsed,
    onToggleCollapse,
}) => {
    const [expandedMenu, setExpandedMenu] = useState<string | null>("system_components");

    const menuItems: MenuItem[] = [
        {
            id: "system_components",
            label: "Componentes do Sistema",
            icon: Layers,
            subItems: [
                { id: "calendar", label: "Calendário Anual" },
                { id: "attendance_sheet", label: "Ficha de Frequência" },
                { id: "presence_launcher", label: "Lançador de Presença" },
                { id: "book_registration", label: "Cadastramento de Livros" },
                { id: "inventory", label: "Estoque" },
            ]
        },
        { id: "checkin", label: "Check-in", icon: CheckSquare },

    ];

    const handleMainItemClick = (item: MenuItem) => {
        if (item.subItems) {
            if (isCollapsed) {
                onToggleCollapse();
                setTimeout(() => setExpandedMenu(item.id), 150);
            } else {
                setExpandedMenu(expandedMenu === item.id ? null : item.id);
            }
        } else {
            onNavigate(item.id);
        }
    };

    return (
        <div
            className={`bg-[linear-gradient(to_left,#2a5298,#1e3c72)] text-slate-300 h-screen flex flex-col transition-all duration-300 border-r border-slate-800 shrink-0 ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Header / Logo Area */}
            <div className="h-16 flex items-center px-4 border-b border-slate-800">
                <div
                    className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""
                        }`}
                >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-900/20">
                        W
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm tracking-wide">
                                Wizard
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                Manager
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
                {!isCollapsed && (
                    <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Menu Principal
                    </div>
                )}
                {menuItems.map((item) => {
                    const isActive = activePage === item.id || item.subItems?.some(sub => sub.id === activePage);
                    const isExpanded = expandedMenu === item.id;

                    return (
                        <div key={item.id} className="flex flex-col">
                            <button
                                onClick={() => handleMainItemClick(item)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${isActive && !item.subItems
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                                    : "hover:bg-slate-800/50 hover:text-white"
                                    } ${isCollapsed ? "justify-center" : ""}`}
                                title={isCollapsed ? item.label : ""}
                            >
                                <item.icon
                                    size={18}
                                    className={`${isActive
                                        ? "text-white"
                                        : "text-slate-400 group-hover:text-white"
                                        }`}
                                />
                                {!isCollapsed && (
                                    <>
                                        <span className={`font-medium flex-1 text-left ${isActive ? "text-white" : ""}`}>{item.label}</span>
                                        {item.subItems && (
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                            />
                                        )}
                                    </>
                                )}

                                {/* Active Indicator for Collapsed Mode */}
                                {isCollapsed && isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                                )}
                            </button>

                            {/* Sub-menu */}
                            {!isCollapsed && item.subItems && isExpanded && (
                                <div className="mt-1 ml-4 pl-4 border-l border-slate-700 space-y-1">
                                    {item.subItems.map((subItem) => (
                                        <button
                                            key={subItem.id}
                                            onClick={() => onNavigate(subItem.id)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activePage === subItem.id
                                                ? "text-blue-400 bg-blue-900/20 font-medium"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                                }`}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${activePage === subItem.id ? "bg-blue-400" : "bg-slate-600"}`} />
                                            <span>{subItem.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer / Settings */}
            <div className="p-3 border-t border-slate-800 bg-transparent">
                <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors ${isCollapsed ? "justify-center" : ""
                        }`}
                    title="Configurações"
                >
                    <Settings size={18} />
                    {!isCollapsed && <span>Configurações</span>}
                </button>

                <button
                    onClick={onToggleCollapse}
                    className="mt-2 w-full flex items-center justify-center p-2 text-slate-500 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
