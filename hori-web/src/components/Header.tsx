import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Settings, BarChart2, FileText } from "lucide-react";

interface HeaderProps {
    student: {
        name: string;
        level: string;
    };
}

const Header: React.FC<HeaderProps> = ({ student }) => {
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="bg-blue-900 p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0 shadow-md z-30">
            <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-300" />
                    Frequência Anual (Ano Civil)
                </h1>
                <p className="text-blue-200 text-xs mt-1">
                    Aluno: <strong>{student.name}</strong> ({student.level}) | Hoje:{" "}
                    <span className="font-semibold text-white">
                        {today.replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Ano Civil & Contrato Info */}
                <div className="flex items-center gap-2 bg-blue-800 p-2 rounded-lg border border-blue-700">
                    <div className="flex flex-col">
                        <label className="text-[9px] text-blue-300 uppercase font-bold">
                            Ano Civil
                        </label>
                        <input
                            type="number"
                            defaultValue={2025}
                            className="text-blue-900 font-bold text-sm px-2 py-0.5 rounded border-none focus:ring-1 w-16 text-center outline-none"
                        />
                    </div>
                    {/* Divider */}
                    <div className="h-6 w-px bg-blue-600 mx-1"></div>
                    <div className="flex flex-col text-right mr-1">
                        <span className="text-[9px] text-blue-300 uppercase font-bold">
                            Vigência Contrato
                        </span>
                        <span className="text-[10px] font-bold text-blue-100">
                            15/02/25 - 15/02/26
                        </span>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md border border-green-500">
                    <FileText size={14} />
                    Matrícula
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                    <BarChart2 size={14} />
                    Dashboard
                </button>

                <button className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors border border-blue-500 shadow-sm">
                    <Settings size={14} />
                    Config
                </button>
            </div>
        </div>
    );
};

export default Header;
