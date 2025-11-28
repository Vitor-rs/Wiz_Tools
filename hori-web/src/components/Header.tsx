import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, BarChart2, FileText } from "lucide-react";
import PageHeader from "./PageHeader";

interface HeaderProps {
    student: {
        name: string;
        level: string;
    };
    year: number;
    onYearChange: (year: number) => void;
    onConfigClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ student, year, onYearChange }) => {
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <PageHeader
            title="Frequência Anual (Ano Civil)"
            subtitle={
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Aluno: <strong className="text-gray-900">{student.name}</strong> ({student.level})</span>
                    <span className="text-gray-300">|</span>
                    <span>Hoje: <strong className="text-gray-900">{today}</strong></span>
                </div>
            }
            actions={
                <div className="flex items-center gap-3">
                    {/* Ano Civil & Contrato Info */}
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <div className="flex flex-col px-1">
                            <label className="text-[9px] text-slate-400 uppercase font-bold">
                                Ano Civil
                            </label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => onYearChange(Number(e.target.value))}
                                className="text-slate-900 font-bold text-sm bg-transparent border-none focus:ring-0 w-12 text-center outline-none p-0"
                            />
                        </div>
                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <div className="flex flex-col text-right mr-1">
                            <span className="text-[9px] text-slate-400 uppercase font-bold">
                                Vigência Contrato
                            </span>
                            <span className="text-[10px] font-bold text-slate-600">
                                15/02/{year.toString().slice(-2)} - 15/02/{(year + 1).toString().slice(-2)}
                            </span>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-sm">
                        <FileText size={14} className="text-green-600" />
                        Matrícula
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm">
                        <BarChart2 size={14} />
                        Dashboard
                    </button>
                </div>
            }
        />
    );
};

export default Header;
