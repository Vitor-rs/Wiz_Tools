import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface MonthsSidebarHandle {
    setHovered: (monthIndex: number | null) => void;
}

interface MonthsSidebarProps {
    year: number;
    onHoverChange?: (data: { monthIndex: number | null; columnIndex: number | null } | null) => void;
    onMonthClick?: (monthIndex: number) => void;
}

const MonthsSidebar = forwardRef<MonthsSidebarHandle, MonthsSidebarProps>(({
    year,
    onHoverChange,
    onMonthClick,
}, ref) => {
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    const cellSize = 34;
    const cellGap = 4;
    const margin = { top: 45 };

    useImperativeHandle(ref, () => ({
        setHovered: (monthIndex) => {
            setHoveredMonth(monthIndex);
        }
    }));

    // Sync highlight box with state
    useEffect(() => {
        if (highlightRef.current) {
            if (hoveredMonth !== null) {
                const top = margin.top + hoveredMonth * (cellSize + cellGap) - cellGap / 2;
                highlightRef.current.style.top = `${top}px`;
                highlightRef.current.style.display = 'block';
            } else {
                highlightRef.current.style.display = 'none';
            }
        }
    }, [hoveredMonth]);

    const months: Date[] = [];
    let current = new Date(year, 0, 1);
    for (let i = 0; i < 12; i++) {
        months.push(current);
        current = addMonths(current, 1);
    }

    return (
        <div className="w-20 bg-white fixed-col-shadow shrink-0 relative z-10">
            {/* Highlight Extension (HTML) - Controlled via Ref/State */}
            <div
                ref={highlightRef}
                className="absolute bg-gray-100/85 border-y border-l border-gray-400 rounded-l-md pointer-events-none z-0"
                style={{
                    display: 'none',
                    left: '3px',
                    height: `${cellSize + cellGap}px`,
                    width: '78px',
                }}
            />
            <svg
                width="100%"
                height={12 * (cellSize + cellGap) + margin.top + 20} // Extra space
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* Header Diagonal */}
                <g>
                    <rect width="80" height="40" fill="#f3f4f6" />
                    <line x1="0" y1="0" x2="80" y2="40" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="55" y="15" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="bold">Dias</text>
                    <text x="25" y="30" textAnchor="middle" fontSize="9" fill="#6b7280" fontWeight="bold">Mês</text>
                    <line x1="0" y1="40" x2="80" y2="40" stroke="#cbd5e1" strokeWidth="1" />
                </g>

                {/* Vertical Border Line (Manual) - Breaks at hovered month */}
                {hoveredMonth === null ? (
                    <line x1="80" y1="0" x2="80" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
                ) : (
                    <>
                        {/* Top segment */}
                        <line
                            x1="80"
                            y1="0"
                            x2="80"
                            y2={margin.top + hoveredMonth * (cellSize + cellGap) - cellGap / 2}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                        {/* Bottom segment */}
                        <line
                            x1="80"
                            y1={margin.top + hoveredMonth * (cellSize + cellGap) - cellGap / 2 + (cellSize + cellGap)}
                            x2="80"
                            y2="100%"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                    </>
                )}

                <g transform={`translate(0, ${margin.top})`}>
                    {months.map((m, i) => {
                        const isHovered = i === hoveredMonth;
                        const y = i * (cellSize + cellGap) + cellSize / 2;

                        return (
                            <text
                                key={i}
                                x={80 - 6}
                                y={y}
                                dy="0.35em"
                                textAnchor="end"
                                fontWeight={isHovered ? "900" : "600"}
                                fontSize="12"
                                fill={isHovered ? "#1e3a8a" : "#1f2937"}
                                className="transition-all duration-100 font-sans cursor-default"
                                style={{
                                    textShadow: isHovered ? "0px 0px 1px #1e3a8a, 0px 0px 10px rgba(59, 130, 246, 0.4)" : "none",
                                    cursor: "pointer",
                                    pointerEvents: 'auto'
                                }}
                                onMouseEnter={() => {
                                    setHoveredMonth(i);
                                    onHoverChange && onHoverChange({ monthIndex: i, columnIndex: null });
                                }}
                                onMouseLeave={() => {
                                    setHoveredMonth(null);
                                    onHoverChange && onHoverChange(null);
                                }}
                                onClick={() => onMonthClick && onMonthClick(i)}
                            >
                                {format(m, "MMMM", { locale: ptBR }).replace(/^\w/, (c) =>
                                    c.toUpperCase()
                                )}
                            </text>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
});

export default MonthsSidebar;
