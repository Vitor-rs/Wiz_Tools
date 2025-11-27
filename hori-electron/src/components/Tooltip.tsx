import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent, Holiday } from "../utils/logic";

interface TooltipProps {
    data: { date: string; events: CalendarEvent[]; holiday?: Holiday } | null;
    position: { x: number; y: number } | null;
    onClose: () => void;
    onTrace: (date: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ data, position, onClose, onTrace }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!data || !position) return null;

    const { date, events, holiday } = data;
    const formattedDate = format(new Date(date + "T12:00:00"), "d 'de' MMMM", {
        locale: ptBR,
    });

    return (
        <div
            ref={ref}
            className="fixed z-50 bg-white/98 backdrop-blur border border-gray-200 rounded-xl shadow-2xl p-3 min-w-[220px] max-w-[280px] tooltip-animate"
            style={{ left: position.x + 10, top: position.y - 10 }}
        >
            <div className="font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2 text-sm">
                {formattedDate}
            </div>

            {holiday && (
                <div className="text-xs font-bold text-purple-600 mb-2">
                    🎉 {holiday.name}
                </div>
            )}

            {events.length === 0 && !holiday && (
                <div className="text-xs text-gray-400 italic">Sem eventos</div>
            )}

            <div className="space-y-2">
                {events.map((ev, i) => (
                    <div key={i} className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <span>{ev.attended ? "✅" : "❌"}</span>
                            <span
                                className={`font-medium ${ev.type === "Falta" ? "text-red-500" : "text-gray-700"
                                    }`}
                            >
                                {ev.type}
                            </span>
                            {ev.arrivalTime && (
                                <span className="ml-auto bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 font-mono">
                                    {ev.arrivalTime}
                                </span>
                            )}
                        </div>

                        {(ev.late || ev.differentTime) && (
                            <div className="text-[10px] text-gray-500 pl-6 mb-1">
                                {ev.late && "• Atraso (<45min)"}
                                {ev.differentTime && "• Horário Diferente"}
                            </div>
                        )}

                        {ev.refDate && (
                            <button
                                onClick={() => onTrace(ev.refDate!)}
                                className="w-full mt-1 flex items-center justify-center gap-1 text-[10px] text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1.5 rounded-md transition-all font-bold"
                            >
                                🎯 Ver {ev.refType} (
                                {format(new Date(ev.refDate + "T12:00:00"), "dd/MM")})
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={onClose}
                className="w-full mt-3 flex items-center justify-center gap-1 text-[10px] text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1.5 rounded-md transition-all font-bold"
            >
                ✕ Fechar
            </button>
        </div>
    );
};

export default Tooltip;
