import React from "react";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthsSidebarProps {
    year: number;
    hoveredMonth: number | null;
    onHoverChange?: (monthIndex: number | null) => void;
}

const MonthsSidebar: React.FC<MonthsSidebarProps> = ({
    year,
    hoveredMonth,
    onHoverChange,
}) => {
    const months: Date[] = [];
    let current = new Date(year, 0, 1);
    for (let i = 0; i < 12; i++) {
        months.push(current);
        current = addMonths(current, 1);
    }

    const cellSize = 34;
    const cellGap = 4;
    const margin = { top: 40 };
    const gridHeaderHeight = 0; // The SVG in CalendarGrid handles the header space now? No, wait.
    // In the Vanilla code, the SVG Months has a gHeader.
    // Let's match the vanilla implementation:
    // gHeader has rect height=40 (margin.top).
    // Then months start at y = mIndex * (cellSize + cellGap) + cellSize/2 (text baseline)

    // Wait, in vanilla:
    // gMonths transform translate(0, 40)
    // mTxt y = mIndex * (cellSize + cellGap) + cellSize/2
    // So the first month text is at 40 + 0 + 17 = 57.

    return (
        <div className="w-20 bg-white border-r border-gray-200 fixed-col-shadow flex-shrink-0 relative z-10">
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
                                    textShadow: isHovered ? "0px 0px 1px #1e3a8a, 0px 0px 10px rgba(59, 130, 246, 0.4)" : "none"
                                }}
                                onMouseEnter={() => onHoverChange && onHoverChange(i)}
                                onMouseLeave={() => onHoverChange && onHoverChange(null)}
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
};

export default MonthsSidebar;
