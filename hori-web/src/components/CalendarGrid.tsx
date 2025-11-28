import React, { useMemo, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { format, getDaysInMonth, addMonths } from "date-fns";
import { FILL_COLORS } from "../utils/logic";
import type { CalendarEvent, Holiday, Config, SpecialDate } from "../types";

export interface CalendarGridHandle {
    setHovered: (monthIndex: number | null, columnIndex: number | null) => void;
}

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
    flashingCell: string | null;
    simulationResult: { validDates: string[]; skippedDates: { date: string; reason: string }[] } | null;
    onHolidayHover: (
        data: { date: string; events: CalendarEvent[]; holiday: Holiday },
        pos: { x: number; y: number }
    ) => void;
    onHolidayLeave: () => void;
    specialDates: SpecialDate[];
}

const MARGIN = { top: 45, right: 20, bottom: 20, left: 10 };
const CELL_SIZE = 34;
const CELL_GAP = 4;
const LOGICAL_GRID_WIDTH = 37; // 31 days + buffer
const TOTAL_MONTHS = 12;
const WEEK_LABELS = ["2ª", "3ª", "4ª", "5ª", "6ª", "Sáb", "Dom"];

type DayData =
    | {
        type: 'valid';
        dayNum: number;
        dateStr: string;
        dayEvents: CalendarEvent[];
        holiday?: Holiday;
        specialDate?: SpecialDate;
        x: number;
        y: number;
        colIndex: number;
        isContract: boolean;
        isContractStartDay: boolean;
        isContractEndDay: boolean;
        mIndex: number;
        isToday: boolean;
    }
    | {
        type: 'empty';
        x: number;
        y: number;
        mIndex: number;
        colIndex: number;
    };

const CalendarGrid = forwardRef<CalendarGridHandle, CalendarGridProps>(({
    data,
    year,
    config,
    holidays,
    onCellClick,
    showSundays,
    onHoverChange,
    flashingCell,
    onHolidayHover,
    onHolidayLeave,
    specialDates
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Crosshair Refs (Direct DOM Manipulation)
    const hBgRef = useRef<HTMLDivElement>(null);
    const vBgRef = useRef<HTMLDivElement>(null);
    const headerHighlightRef = useRef<HTMLDivElement>(null);
    const hBorderRef = useRef<HTMLDivElement>(null);
    const vBorderRef = useRef<HTMLDivElement>(null);
    const prevHoveredColRef = useRef<number | null>(null);

    // Calculate Grid Dimensions
    const { gridWidth, totalHeight } = useMemo(() => {
        let count = 0;
        for (let i = 0; i < LOGICAL_GRID_WIDTH; i++) {
            if (showSundays || i % 7 !== 6) count++;
        }
        const width =
            (CELL_SIZE + CELL_GAP) * count + MARGIN.left + MARGIN.right;
        const fullContentHeight = (CELL_SIZE + CELL_GAP) * TOTAL_MONTHS;
        const height = fullContentHeight + MARGIN.top + MARGIN.bottom;
        return { gridWidth: width, totalHeight: height };
    }, [showSundays]);

    // Helper to calculate X position
    const getVisualX = useCallback((colIndex: number) => {
        if (!showSundays && colIndex % 7 === 6) return -1;
        const skipped = !showSundays ? Math.floor((colIndex + 1) / 7) : 0;
        return (colIndex - skipped) * (CELL_SIZE + CELL_GAP);
    }, [showSundays]);

    // Render Helpers
    const barHeight = (CELL_SIZE + CELL_GAP) * TOTAL_MONTHS + 30; // Extra height for crosshair

    // Direct DOM Update Function
    const updateCrosshair = useCallback((monthIndex: number | null, columnIndex: number | null) => {
        // Horizontal Bar (Month)
        if (hBgRef.current && hBorderRef.current) {
            if (monthIndex !== null && monthIndex >= 0) {
                const top = MARGIN.top + monthIndex * (CELL_SIZE + CELL_GAP) - CELL_GAP / 2;
                const style = {
                    display: 'block',
                    top: `${top}px`,
                    left: '0px',
                    width: `${gridWidth}px`,
                    height: `${CELL_SIZE + CELL_GAP}px`
                };
                Object.assign(hBgRef.current.style, style);
                Object.assign(hBorderRef.current.style, style);
            } else {
                hBgRef.current.style.display = 'none';
                hBorderRef.current.style.display = 'none';
            }
        }

        // Vertical Bar (Column)
        if (vBgRef.current && vBorderRef.current && headerHighlightRef.current) {
            if (columnIndex !== null) {
                const x = getVisualX(columnIndex);
                const left = MARGIN.left + x - CELL_GAP / 2;

                // Gray vertical bar
                const style = {
                    display: 'block',
                    top: `${MARGIN.top - 28}px`,
                    left: `${left}px`,
                    width: `${CELL_SIZE + CELL_GAP}px`,
                    height: `${barHeight}px`
                };
                Object.assign(vBgRef.current.style, style);
                Object.assign(vBorderRef.current.style, style);

                // Blue header highlight (tip)
                const headerStyle = {
                    display: 'block',
                    top: `${MARGIN.top - 28}px`, // Match vertical bar top
                    left: `${left}px`,
                    width: `${CELL_SIZE + CELL_GAP}px`,
                    height: '23px', // 28 - 5 = 23px (Ends at dotted line)
                };
                Object.assign(headerHighlightRef.current.style, headerStyle);

            } else {
                vBgRef.current.style.display = 'none';
                vBorderRef.current.style.display = 'none';
                headerHighlightRef.current.style.display = 'none';
            }
        }

        // Column Label Highlight
        if (columnIndex !== prevHoveredColRef.current) {
            if (prevHoveredColRef.current !== null) {
                const prevLabel = document.getElementById(`col-label-${prevHoveredColRef.current}`);
                if (prevLabel) {
                    const isWeekend = prevHoveredColRef.current % 7 >= 5;
                    prevLabel.setAttribute('fill', isWeekend ? "#64748b" : "#374151");
                    prevLabel.setAttribute('font-weight', "bold");
                }
            }
            if (columnIndex !== null) {
                const newLabel = document.getElementById(`col-label-${columnIndex}`);
                if (newLabel) {
                    newLabel.setAttribute('fill', "#ffffff");
                    newLabel.setAttribute('font-weight', "900");
                }
            }
            prevHoveredColRef.current = columnIndex;
        }
    }, [gridWidth, barHeight, getVisualX]);

    useImperativeHandle(ref, () => ({
        setHovered: (monthIndex, columnIndex) => {
            updateCrosshair(monthIndex, columnIndex);
        }
    }));

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

        for (let mIndex = 0; mIndex < TOTAL_MONTHS; mIndex++) {
            const loopYear = currentRenderDate.getFullYear();
            const loopMonth = currentRenderDate.getMonth();
            const daysInMonthCount = getDaysInMonth(currentRenderDate);

            const startDayOfWeek = new Date(loopYear, loopMonth, 1).getDay();
            const gridOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

            const days: DayData[] = [];
            for (let c = 0; c < LOGICAL_GRID_WIDTH; c++) {
                const x = getVisualX(c);
                if (x === -1) continue;

                const dayNum = c - gridOffset + 1;
                const isValidDay = dayNum > 0 && dayNum <= daysInMonthCount;

                if (isValidDay) {
                    const date = new Date(loopYear, loopMonth, dayNum);
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dayEvents = dataByDate[dateStr] || [];
                    const holiday = holidays.find((h) => h.date === dateStr);
                    const specialDate = specialDates.find((sd) => sd.date === dateStr);

                    const time = date.getTime();
                    const isContract =
                        time >= contractStart.getTime() && time <= contractEnd.getTime();

                    const isContractStartDay = dateStr === contractStartStr;
                    const isContractEndDay = dateStr === contractEndStr;
                    const isToday = dateStr === todayStr;

                    days.push({
                        type: 'valid',
                        dayNum,
                        dateStr,
                        dayEvents,
                        holiday,
                        specialDate,
                        x,
                        y: mIndex * (CELL_SIZE + CELL_GAP),
                        colIndex: c,
                        isContract,
                        isContractStartDay,
                        isContractEndDay,
                        mIndex,
                        isToday
                    });
                } else {
                    days.push({
                        type: 'empty',
                        x,
                        y: mIndex * (CELL_SIZE + CELL_GAP),
                        mIndex,
                        colIndex: c
                    });
                }
            }
            months.push({ mIndex, days });
            currentRenderDate = addMonths(currentRenderDate, 1);
        }
        return months;
    }, [year, data, holidays, config.startDate, getVisualX, specialDates]);

    const handleMouseLeave = () => {
        updateCrosshair(null, null);
        onHoverChange(null);
    };

    return (
        <div
            ref={containerRef}
            className="overflow-auto custom-scrollbar flex-1 bg-white relative"
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative min-w-max min-h-max">
                {/* Layer 1: Backgrounds (Weekends) - HTML */}
                {Array.from({ length: LOGICAL_GRID_WIDTH }).map((_, c) => {
                    if (c % 7 === 5) { // Saturday
                        const x = getVisualX(c);
                        if (x !== -1) {
                            return (
                                <div
                                    key={`bg-weekend-${c}`}
                                    className="absolute bg-slate-200/50 border-r border-gray-300/50 rounded-b-lg pointer-events-none"
                                    style={{
                                        left: MARGIN.left + x - CELL_GAP / 2,
                                        top: 0, // Top of container (covering margin)
                                        width: (CELL_SIZE + CELL_GAP) * 2,
                                        height: (CELL_SIZE + CELL_GAP) * TOTAL_MONTHS + MARGIN.top + 2,
                                        borderRadius: '0 0 8px 8px'
                                    }}
                                />
                            );
                        }
                    }
                    return null;
                })}

                {/* Layer 2: Crosshair Backgrounds - HTML (Refs) */}
                <div
                    ref={hBgRef}
                    className="absolute bg-gray-100/85 rounded-r-md pointer-events-none"
                    style={{ display: 'none' }}
                />
                <div
                    ref={vBgRef}
                    className="absolute bg-gray-100/85 rounded-md pointer-events-none"
                    style={{ display: 'none' }}
                />
                <div
                    ref={headerHighlightRef}
                    className="absolute bg-blue-600 rounded-t-md pointer-events-none"
                    style={{ display: 'none' }}
                />

                {/* Layer 3 & 4: SVG Content (Labels & Cells) */}
                <svg
                    width={gridWidth}
                    height={totalHeight}
                    className="block relative z-10"
                    style={{ pointerEvents: 'none' }} // Let clicks pass through if needed, but cells need events
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

                    <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                        {/* Layer 3: Column Labels */}
                        <g>
                            {/* Dotted border line below week headers */}
                            <line
                                x1="0"
                                y1="-5"
                                x2={gridWidth - MARGIN.left - MARGIN.right}
                                y2="-5"
                                stroke="#cbd5e1"
                                strokeWidth="1"
                                strokeDasharray="3,3"
                                strokeLinecap="round"
                            />
                            {Array.from({ length: LOGICAL_GRID_WIDTH }).map((_, c) => {
                                const x = getVisualX(c);
                                if (x !== -1) {
                                    return (
                                        <text
                                            key={`col-${c}`}
                                            id={`col-label-${c}`}
                                            x={x + CELL_SIZE / 2}
                                            y={-15}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="bold"
                                            fill={c % 7 >= 5 ? "#64748b" : "#374151"}
                                            className="font-sans cursor-default transition-colors duration-150"
                                            style={{ pointerEvents: 'auto' }}
                                            onMouseEnter={() => {
                                                // We don't have month index here easily, but we can assume 0 or just update col
                                                // Actually, labels are outside the grid data loop.
                                                // Let's just update the column highlight and notify App
                                                // We don't know the month index here, so maybe just keep previous month or null?
                                                // The user usually enters from top, so maybe month 0?
                                                // Or better: don't trigger crosshair on labels, just highlight label.
                                                updateCrosshair(null, c);
                                                onHoverChange({ monthIndex: -1, columnIndex: c }); // Use -1 or null to indicate "header only"
                                            }}
                                        >
                                            {WEEK_LABELS[c % 7]}
                                        </text>
                                    );
                                }
                                return null;
                            })}
                        </g>

                        {/* Layer 4: Cells & Ghost Cells */}
                        <g>
                            {gridData.map((month) =>
                                month.days.map((day) => {
                                    // Ghost Cell for empty regions
                                    if (day.type === 'empty') {
                                        return (
                                            <rect
                                                key={`empty-${day.mIndex}-${day.colIndex}`}
                                                x={day.x}
                                                y={day.y}
                                                width={CELL_SIZE}
                                                height={CELL_SIZE}
                                                fill="transparent"
                                                style={{ pointerEvents: 'auto' }}
                                                onMouseEnter={() => handleMouseLeave()}
                                            />
                                        );
                                    }

                                    const {
                                        dayNum,
                                        dateStr,
                                        dayEvents,
                                        holiday,
                                        specialDate,
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

                                    const bgFill = !isContract
                                        ? "#e5e7eb"
                                        : hasClasses
                                            ? "#ffffff"
                                            : specialDate
                                                ? "#fbcfe8" // Pink-200 for special dates
                                                : isWeekend
                                                    ? "rgba(255,255,255,0.4)"
                                                    : holiday
                                                        ? "#fee2e2"
                                                        : "#f9fafb";

                                    const bgOpacity = !isContract ? 0.3 : 1;
                                    const stroke = "#e5e7eb";
                                    const strokeWidth = 0.5;

                                    // Interactive State - Handled by Refs now, so no React hover logic here
                                    const isClickable = hasClasses;
                                    const isHoverable = (holiday || specialDate) && !hasClasses;

                                    return (
                                        <g
                                            key={dateStr}
                                            id={`cell-${dateStr}`}
                                            transform={`translate(${x}, ${y})`}
                                            className={isFlashing ? "animate-flip-2" : ""}
                                            style={{
                                                cursor: isClickable ? "pointer" : isHoverable ? "help" : "default",
                                                pointerEvents: 'auto'
                                            }}
                                            onMouseEnter={(e) => {
                                                updateCrosshair(day.mIndex, day.colIndex);
                                                onHoverChange({ monthIndex: day.mIndex, columnIndex: day.colIndex });

                                                if ((holiday || specialDate) && !hasClasses) {
                                                    const rectBox = e.currentTarget.getBoundingClientRect();
                                                    const holidayData = holiday || (specialDate ? {
                                                        date: specialDate.date,
                                                        name: specialDate.description,
                                                        type: 'Data Especial'
                                                    } : undefined);

                                                    if (holidayData) {
                                                        onHolidayHover(
                                                            { date: dateStr, events: [], holiday: holidayData },
                                                            { x: rectBox.right, y: rectBox.top }
                                                        );
                                                    }
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                if (holiday || specialDate) onHolidayLeave();
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
                                        >
                                            {/* Cell Rect */}
                                            <rect
                                                width={CELL_SIZE}
                                                height={CELL_SIZE}
                                                rx={6}
                                                fill={bgFill}
                                                fillOpacity={bgOpacity}
                                                stroke={stroke}
                                                strokeWidth={strokeWidth}
                                                className="hover:stroke-blue-500 hover:stroke-2 hover:fill-blue-50 hover:[fill-opacity:1]"
                                                style={{ filter: hasClasses ? "url(#cell-shadow)" : "none" }}
                                            />

                                            {/* Day Number */}
                                            <text
                                                x={CELL_SIZE / 2}
                                                y={CELL_SIZE / 2}
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
                                                <g transform={`translate(0, ${CELL_SIZE - 7})`}>
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
                                                        const totalWidthAvailable = CELL_SIZE - padding * 2;
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
                                                <path d={`M ${CELL_SIZE} ${CELL_SIZE - 6} Q ${CELL_SIZE} ${CELL_SIZE} ${CELL_SIZE - 6} L ${CELL_SIZE - 14} ${CELL_SIZE} L ${CELL_SIZE} ${CELL_SIZE - 14} Z`} fill="#f97316" className="pointer-events-none" />
                                            )}

                                            {/* Today Highlight */}
                                            {isToday && (
                                                <rect width={CELL_SIZE} height={CELL_SIZE} rx={6} fill="none" stroke="#6366f1" strokeWidth="2.5" className="pointer-events-none animate-pulse" />
                                            )}
                                        </g>
                                    );
                                })
                            )}
                        </g>
                    </g>
                </svg>

                {/* Layer 5: Crosshair Borders (Overlay) - HTML (Refs) */}
                <div
                    ref={hBorderRef}
                    className="absolute border border-gray-400 border-l-0 rounded-r-md pointer-events-none z-20"
                    style={{ display: 'none' }}
                />
                <div
                    ref={vBorderRef}
                    className="absolute border border-gray-400 rounded-md pointer-events-none z-20"
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
});

export default React.memo(CalendarGrid);
