import React from "react";

interface LegendProps {
    showSundays: boolean;
    onToggleSundays: (show: boolean) => void;
    onRecalculate: () => void;
    year: number;
    onYearChange: (year: number) => void;
}

const Legend: React.FC<LegendProps> = ({
    showSundays,
    onToggleSundays,
    onRecalculate,
}) => {
    return (
        <div className="p-2 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center text-xs shrink-0 z-20">
            <div className="flex flex-wrap gap-4 justify-center items-center">
                {/* Smart Pills Legenda */}
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-green-500"></span> Normal
                </div>
                <div className="flex items-center gap-1.5" title="Atraso (1-45min)">
                    <span className="w-3 h-1 rounded-full bg-linear-to-r from-orange-500 to-green-500"></span>{" "}
                    Atraso
                </div>
                <div className="flex items-center gap-1.5" title="Outro Horário">
                    <span className="w-3 h-1 rounded-full bg-linear-to-l from-pink-500 to-green-500"></span>{" "}
                    Horário Dif.
                </div>

                <div className="flex items-center gap-1.5 ml-3 pl-3 border-l border-gray-300">
                    <span className="w-3 h-1 rounded-full bg-red-500"></span> Falta
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-amber-400 border border-green-700"></span>{" "}
                    Reposição
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 rounded-full bg-purple-400 border border-green-700"></span>{" "}
                    Anteposição
                </div>
                <div className="flex items-center gap-1.5" title="Previsto no Contrato">
                    <span className="w-3 h-1 rounded-full bg-green-100"></span> Futuro
                </div>

                <div
                    className="flex items-center gap-1.5 ml-3 pl-3 border-l border-gray-300"
                    title="Orelha Azul: Início do Contrato"
                >
                    <svg width="10" height="10" className="mr-1">
                        <path d="M 0 6 Q 0 0 6 0 L 14 0 L 0 14 Z" fill="#2563eb" />
                    </svg>
                    Início
                </div>
                <div
                    className="flex items-center gap-1.5"
                    title="Orelha Laranja: Fim do Contrato"
                >
                    <svg width="10" height="10" className="mr-1">
                        <path
                            d="M 10 4 Q 10 10 4 10 L 0 10 L 10 0 Z"
                            fill="#f97316"
                        />
                    </svg>
                    Fim
                </div>
            </div>

            <div className="flex items-center gap-4">
                <label className="inline-flex items-center cursor-pointer select-none gap-2 text-gray-600 font-medium">
                    <input
                        type="checkbox"
                        checked={showSundays}
                        onChange={(e) => onToggleSundays(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    Domingos
                </label>
                <button
                    onClick={onRecalculate}
                    className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors shadow-sm"
                >
                    Recalcular
                </button>
            </div>
        </div>
    );
};

export default Legend;
