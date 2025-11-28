import React from "react";
import {
    Calendar,
    FileText,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    BarChart2,
    CheckSquare,
} from "lucide-react";

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePage,
    onNavigate,
    isCollapsed,
    onToggleCollapse,
}) => {
    const menuItems = [
        { id: "calendar", label: "Frequência Anual", icon: Calendar },
        { id: "checkin", label: "Check-in", icon: CheckSquare },
        { id: "attendance_sheet", label: "Ficha de Frequência", icon: FileText },
        { id: "enrollment", label: "Matrícula", icon: Users },
        { id: "simulation", label: "Simulação", icon: Settings },
        { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    ];

    return (
        <div
            className={`bg-[#0f172a] text-slate-300 h-screen flex flex-col transition-all duration-300 border-r border-slate-800 ${isCollapsed ? "w-16" : "w-64"
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
            <nav className="flex-1 py-6 px-2 space-y-1">
                {!isCollapsed && (
                    <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Menu Principal
                    </div>
                )}
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${activePage === item.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                            : "hover:bg-slate-800/50 hover:text-white"
                            } ${isCollapsed ? "justify-center" : ""}`}
                        title={isCollapsed ? item.label : ""}
                    >
                        <item.icon
                            size={18}
                            className={`${activePage === item.id
                                ? "text-white"
                                : "text-slate-400 group-hover:text-white"
                                }`}
                        />
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}

                        {/* Active Indicator for Collapsed Mode */}
                        {isCollapsed && activePage === item.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / Settings */}
            <div className="p-3 border-t border-slate-800 bg-[#0f172a]">
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
