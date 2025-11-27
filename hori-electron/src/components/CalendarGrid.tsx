import React, { useMemo, useEffect, useRef } from "react";
import { format, getDaysInMonth, addMonths } from "date-fns";
import { FILL_COLORS, CalendarEvent, Config, Holiday } from "../utils/logic";

interface CalendarGridProps {
    data: CalendarEvent[];
    year: number;
    config: Config;
    holidays: Holiday[];
    onCellClick: (
        data: { date: string; events: CalendarEvent[]; holiday?: Holiday },
        pos: { x: number; y: number }
    ) => void;
    showSundays: boolean;
    onHoverChange: (
        data: { monthIndex: number; columnIndex: number } | null
    ) => void;
    hoveredColumn: number | null;
    hoveredMonth: number | null;
    flashingCell: string | null;
    onHolidayHover: (
        data: { date: string; events: CalendarEvent[]; holiday: Holiday },
        pos: { x: number; y: number }
    ) => void;
    onHolidayLeave: () => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    data,
    year,
    config,
    holidays,
    onCellClick,
    showSundays,
    onHoverChange,
    hoveredColumn,
    hoveredMonth,
    flashingCell,
    onHolidayHover,
    onHolidayLeave,
}) => {
    // Dimensions
    const margin = { top: 40, right: 20, bottom: 20, left: 10 };
    const cellSize = 34;
    const cellGap = 4;
    const logicalGridWidth = 37; // 31 days + buffer
    const totalMonths = 12;

    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to flashing cell
    useEffect(() => {
        if (flashingCell && containerRef.current) {
            const element = document.getElementById(`cell-${flashingCell}`);
            if (element) {
                const container = containerRef.current;
                const elementRect = element.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Calculate relative position
                const relativeTop = elementRect.top - containerRect.top;

                // Calculate target scroll position to center the element
                const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (elementRect.height / 2);

                container.scrollTo({
                    top: targetScroll,
                    behavior: "smooth"
                });
            }
        }
    }, [flashingCell]);

    // Helper to calculate X position
    const getVisualX = (colIndex: number) => {
        if (!showSundays && colIndex % 7 === 6) return -1;
        let skipped = !showSundays ? Math.floor((colIndex + 1) / 7) : 0;
        return (colIndex - skipped) * (cellSize + cellGap);
    };

    // Calculate Grid Dimensions
    const { gridWidth, totalHeight, visualColsCount } = useMemo(() => {
        let visualColsCount = 0;
        for (let i = 0; i < logicalGridWidth; i++) {
            if (showSundays || i % 7 !== 6) visualColsCount++;
        }
        const width =
            (cellSize + cellGap) * visualColsCount + margin.left + margin.right;
        const fullContentHeight = (cellSize + cellGap) * totalMonths;
        const height = fullContentHeight + margin.top + margin.bottom;
        return { gridWidth: width, totalHeight: height, visualColsCount };
    }, [showSundays, logicalGridWidth, totalMonths, margin]);

    // Prepare Data for Rendering
    const gridData = useMemo(() => {
        const dataByDate: Record<string, CalendarEvent[]> = {};
        if (data) {
            data.forEach((d) => {
                if (!dataByDate[d.date]) dataByDate[d.date] = [];
                dataByDate[d.date].push(d);
            });
        }

        const months = [];
        let currentRenderDate = new Date(year, 0, 1);

        // Parse contract dates
        const contractStart = new Date(config.startDate + "T12:00:00");
        const contractEnd = new Date(contractStart);
        contractEnd.setFullYear(contractEnd.getFullYear() + 1);

        const contractStartStr = format(contractStart, "yyyy-MM-dd");
        const contractEndStr = format(contractEnd, "yyyy-MM-dd");
        const todayStr = format(new Date(), "yyyy-MM-dd");

        for (let mIndex = 0; mIndex < totalMonths; mIndex++) {
            const loopYear = currentRenderDate.getFullYear();
            const loopMonth = currentRenderDate.getMonth();
            const daysInMonthCount = getDaysInMonth(currentRenderDate);

            const startDayOfWeek = new Date(loopYear, loopMonth, 1).getDay();
            const gridOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

            const days = [];
            for (let c = 0; c < logicalGridWidth; c++) {
                const x = getVisualX(c);
                if (x === -1) continue;

                const dayNum = c - gridOffset + 1;
                const isValidDay = dayNum > 0 && dayNum <= daysInMonthCount;

                if (isValidDay) {
                    const date = new Date(loopYear, loopMonth, dayNum);
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayEvents = dataByDate[dateStr] || [];
                    const holiday = holidays.find((h) => h.date === dateStr);

                    const time = date.getTime();
                    const isContract =
                        time >= contractStart.getTime() && time <= contractEnd.getTime();

                    const isContractStartDay = dateStr === contractStartStr;
                    const isContractEndDay = dateStr === contractEndStr;
                    const isToday = dateStr === todayStr;

                    days.push({
                        dayNum,
                        dateStr,
                        dayEvents,
                        holiday,
                        x,
                        y: mIndex * (cellSize + cellGap),
                        colIndex: c,
                        isContract,
                        isContractStartDay,
                        isContractEndDay,
                        mIndex,
                        isToday
                    });
                }
            }
            months.push({ mIndex, days });
            currentRenderDate = addMonths(currentRenderDate, 1);
        }
        return months;
    }, [year, data, holidays, showSundays, config.startDate]);

    // Render Helpers
    const weekLabels = ["2ª", "3ª", "4ª", "5ª", "6ª", "Sáb", "Dom"];
    const barHeight = (cellSize + cellGap) * totalMonths + 30; // Extra height for crosshair

    return (
        <div ref={containerRef} className="overflow-auto custom-scrollbar flex-1 bg-white relative">
            <svg
                width={gridWidth}
                height={totalHeight}
                className="block"
                onMouseLeave={() => {
                    if (onHoverChange) onHoverChange(null);
                }}
            >
                <defs>
                    <filter id="cell-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.08" />
                    </filter>
                    <linearGradient id="grad-late">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="25%" stopColor="#f97316" />
                        <stop offset="40%" stopColor="#22c55e" />
                    </linearGradient>
                    <linearGradient id="grad-diff">
                        <stop offset="60%" stopColor="#22c55e" />
                        <stop offset="75%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <linearGradient id="grad-both">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="20%" stopColor="#f97316" />
                        <stop offset="35%" stopColor="#22c55e" />
                        <stop offset="65%" stopColor="#22c55e" />
                        <stop offset="80%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>

                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Layer 1: Backgrounds (Weekends) */}
                    <g>
                        {Array.from({ length: logicalGridWidth }).map((_, c) => {
                            if (c % 7 === 5 || c % 7 === 6) {
                                const x = getVisualX(c);
                                if (x !== -1) {
                                    return (
                                        <rect
                                            key={`bg-${c}`}
                                            x={x - cellGap / 2}
                                            y={-28}
                                            width={cellSize + cellGap}
                                            height={barHeight}
                                            fill="#e2e8f0"
                                            rx={4}
                                        />
                                    );
                                }
                            }
                            return null;
                        })}
                    </g>

                    {/* Layer 2: Crosshair Backgrounds */}
                    <g>
                        {hoveredMonth !== null && (
                            <rect
                                x={-margin.left}
                                y={hoveredMonth * (cellSize + cellGap) - cellGap / 2}
                                width={gridWidth}
                                height={cellSize + cellGap}
                                rx={6}
                                fill="rgba(243, 244, 246, 0.85)"
                                className="pointer-events-none transition-opacity duration-75"
                            />
                        )}
                        {hoveredColumn !== null && (
                            <rect
                                x={getVisualX(hoveredColumn) - cellGap / 2}
                                y={-28}
                                width={cellSize + cellGap}
                                height={barHeight}
                                rx={6}
                                fill="rgba(243, 244, 246, 0.85)"
                                className="pointer-events-none transition-opacity duration-75"
                            />
                        )}
                    </g>

                    {/* Layer 3: Column Labels */}
                    <g>
                        {Array.from({ length: logicalGridWidth }).map((_, c) => {
                            const x = getVisualX(c);
                            if (x !== -1) {
                                const isHovered = c === hoveredColumn;
                                return (
                                    <text
                                        key={`col-${c}`}
                                        x={x + cellSize / 2}
                                        y={-15}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="bold"
                                        fill={isHovered ? "#2563eb" : c % 7 >= 5 ? "#64748b" : "#374151"}
                                        className="transition-all duration-100 font-sans cursor-default"
                                        onMouseEnter={() => onHoverChange({ monthIndex: hoveredMonth || 0, columnIndex: c })}
                                    >
                                        {weekLabels[c % 7]}
                                    </text>
                                );
                            }
                            return null;
                        })}
                    </g>

                    {/* Layer 4: Cells */}
                    <g>
                        {gridData.map((month) =>
                            month.days.map((day) => {
                                const {
                                    dayNum,
                                    dateStr,
                                    dayEvents,
                                    holiday,
                                    x,
                                    y,
                                    isContract,
                                    isContractStartDay,
                                    isContractEndDay,
                                    isToday
                                } = day;
                                const hasClasses = dayEvents.length > 0;
                                const isWeekend = day.colIndex % 7 >= 5;
                                const isFlashing = flashingCell === dateStr;

                                let bgFill = !isContract
                                    ? "#e5e7eb"
                                    : hasClasses
                                        ? "#ffffff"
                                        : isWeekend
                                            ? "rgba(255,255,255,0.4)"
                                            : holiday
                                                ? "#fee2e2"
                                                : "#f9fafb";

                                let bgOpacity = !isContract ? 0.3 : 1;
                                let stroke = hasClasses ? "#e5e7eb" : "none";
                                let strokeWidth = hasClasses ? 1 : 0;

                                // Interactive State
                                const isHovered = hoveredMonth === day.mIndex && hoveredColumn === day.colIndex;
                                const isClickable = hasClasses;
                                const isHoverable = holiday && !hasClasses;

                                if (isHovered && (isClickable || isHoverable)) {
                                    bgFill = "#dae4f0";
                                }

                                return (
                                    <g
                                        key={dateStr}
                                        id={`cell-${dateStr}`}
                                        transform={`translate(${x}, ${y})`}
                                        className={isFlashing ? "animate-flip-2" : ""}
                                        onMouseEnter={(e) => {
                                            onHoverChange({ monthIndex: day.mIndex, columnIndex: day.colIndex });
                                            if (holiday && !hasClasses) {
                                                const rectBox = e.currentTarget.getBoundingClientRect();
                                                onHolidayHover(
                                                    { date: dateStr, events: [], holiday },
                                                    { x: rectBox.right, y: rectBox.top }
                                                );
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (holiday) onHolidayLeave();
                                        }}
                                        onClick={(e) => {
                                            if (hasClasses) {
                                                e.stopPropagation();
                                                const rectBox = e.currentTarget.getBoundingClientRect();
                                                onCellClick(
                                                    { date: dateStr, events: dayEvents, holiday },
                                                    { x: rectBox.right, y: rectBox.top }
                                                );
                                            }
                                        }}
                                        style={{ cursor: isClickable ? "pointer" : isHoverable ? "help" : "default" }}
                                    >
                                        {/* Cell Rect */}
                                        <rect
                                            width={cellSize}
                                            height={cellSize}
                                            rx={isHovered && (isClickable || isHoverable) ? 0 : 6}
                                            fill={bgFill}
                                            fillOpacity={bgOpacity}
                                            stroke={stroke}
                                            strokeWidth={strokeWidth}
                                            style={{ filter: hasClasses ? "url(#cell-shadow)" : "none", transition: "all 0.1s ease-out" }}
                                        />

                                        {/* Day Number */}
                                        <text
                                            x={cellSize / 2}
                                            y={cellSize / 2}
                                            dy={hasClasses ? "0.1em" : "0.35em"}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill={!isContract ? "#9ca3af" : hasClasses ? "#374151" : "#9ca3af"}
                                            className="pointer-events-none select-none font-sans"
                                        >
                                            {dayNum}
                                        </text>

                                        {/* Smart Pills */}
                                        {hasClasses && (
                                            <g transform={`translate(0, ${cellSize - 7})`}>
                                                {(() => {
                                                    const normalClass = dayEvents.filter(
                                                        (ev) => ev.type === "Normal" && ev.attended
                                                    );
                                                    const otherClasses = dayEvents.filter(
                                                        (ev) => ev.type !== "Normal" || !ev.attended
                                                    );
                                                    const totalPills = normalClass.length + otherClasses.length;
                                                    const barHeight = 4;
                                                    const padding = 2;
                                                    const totalWidthAvailable = cellSize - padding * 2;
                                                    const gap = 1;
                                                    const pillWidth =
                                                        (totalWidthAvailable - gap * (totalPills - 1)) / totalPills;

                                                    return (
                                                        <>
                                                            {normalClass.map((cls, i) => {
                                                                let fill = FILL_COLORS.Normal;
                                                                if (cls.late && cls.differentTime) fill = "url(#grad-both)";
                                                                else if (cls.late) fill = "url(#grad-late)";
                                                                else if (cls.differentTime) fill = "url(#grad-diff)";

                                                                return (
                                                                    <rect
                                                                        key={`n-${i}`}
                                                                        x={padding + i * (pillWidth + gap)}
                                                                        y={0}
                                                                        width={pillWidth}
                                                                        height={barHeight}
                                                                        rx={1.5}
                                                                        fill={fill}
                                                                    />
                                                                );
                                                            })}
                                                            {otherClasses.map((cls, i) => {
                                                                let s = "none";
                                                                let sw = 0;
                                                                if (
                                                                    (cls.type === "Reposição" || cls.type === "Anteposição") &&
                                                                    cls.attended
                                                                ) {
                                                                    s = "#15803d";
                                                                    sw = 1;
                                                                }
                                                                const xPos =
                                                                    padding +
                                                                    (normalClass.length + i) * (pillWidth + gap);
                                                                return (
                                                                    <rect
                                                                        key={`o-${i}`}
                                                                        x={xPos}
                                                                        y={0}
                                                                        width={pillWidth}
                                                                        height={barHeight}
                                                                        rx={1.5}
                                                                        fill={FILL_COLORS[cls.type]}
                                                                        stroke={s}
                                                                        strokeWidth={sw}
                                                                    />
                                                                );
                                                            })}
                                                        </>
                                                    );
                                                })()}
                                            </g>
                                        )}

                                        {/* Dog Ears */}
                                        {isContractStartDay && (
                                            <path d="M 0 6 Q 0 0 6 0 L 14 0 L 0 14 Z" fill="#2563eb" className="pointer-events-none" />
                                        )}
                                        {isContractEndDay && (
                                            <path d={`M ${cellSize} ${cellSize - 6} Q ${cellSize} ${cellSize} ${cellSize - 6} ${cellSize} L ${cellSize - 14} ${cellSize} L ${cellSize} ${cellSize - 14} Z`} fill="#f97316" className="pointer-events-none" />
                                        )}

                                        {/* Today Highlight */}
                                        {isToday && (
                                            <rect width={cellSize} height={cellSize} rx={6} fill="none" stroke="#6366f1" strokeWidth="2.5" className="pointer-events-none animate-pulse" />
                                        )}
                                    </g>
                                );
                            })
                        )}
                    </g>

                    {/* Layer 5: Crosshair Borders (Overlay) */}
                    <g className="pointer-events-none">
                        {hoveredMonth !== null && (
                            <rect
                                x={-margin.left}
                                y={hoveredMonth * (cellSize + cellGap) - cellGap / 2}
                                width={gridWidth}
                                height={cellSize + cellGap}
                                rx={6}
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="1"
                            />
                        )}
                        {hoveredColumn !== null && (
                            <rect
                                x={getVisualX(hoveredColumn) - cellGap / 2}
                                y={-28}
                                width={cellSize + cellGap}
                                height={barHeight}
                                rx={6}
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="1"
                            />
                        )}
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default CalendarGrid;
