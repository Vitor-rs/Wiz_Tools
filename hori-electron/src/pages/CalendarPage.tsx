import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import MonthsSidebar from "../components/MonthsSidebar";
import CalendarGrid from "../components/CalendarGrid";
import Tooltip from "../components/Tooltip";
import { generateCalendarData, Config, Holiday, CalendarEvent } from "../utils/logic";

const CalendarPage: React.FC = () => {
    const [year, setYear] = useState(2025);
    const [showSundays, setShowSundays] = useState(true);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
    const [tooltipData, setTooltipData] = useState<{ date: string; events: CalendarEvent[]; holiday?: Holiday } | null>(null);
    const [flashingCell, setFlashingCell] = useState<string | null>(null);
    const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
    const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

    // Configuration State
    const [config, setConfig] = useState<Config>({
        startDate: "2025-01-15",
        monthsDuration: 12,
        days: [1, 3], // Mon, Wed
        time: "13:00",
    });

    const [student] = useState({
        name: "João da Silva",
        level: "W4",
    });

    const [holidays, setHolidays] = useState<Holiday[]>([
        { date: "2025-01-01", name: "Ano Novo" },
        { date: "2025-03-03", name: "Recesso Carnaval" },
        { date: "2025-03-04", name: "Carnaval" },
        { date: "2025-04-18", name: "Sexta-feira Santa" },
        { date: "2025-04-21", name: "Tiradentes" },
        { date: "2025-05-01", name: "Dia do Trabalho" },
        { date: "2025-06-19", name: "Corpus Christi" },
        { date: "2025-06-20", name: "Ponte Corpus Christi" },
        { date: "2025-09-07", name: "Independência" },
        { date: "2025-10-11", name: "Criação do MS" },
        { date: "2025-10-12", name: "Nsa. Sra. Aparecida" },
        { date: "2025-10-13", name: "Semana do Saco Cheio" },
        { date: "2025-10-14", name: "Semana do Saco Cheio" },
        { date: "2025-10-15", name: "Dia do Professor" },
        { date: "2025-10-16", name: "Semana do Saco Cheio" },
        { date: "2025-10-17", name: "Semana do Saco Cheio" },
        { date: "2025-11-02", name: "Finados" },
        { date: "2025-11-15", name: "Proclamação da República" },
        { date: "2025-11-20", name: "Dia da Consciência Negra" },
        { date: "2025-12-25", name: "Natal" },
    ]);

    // Generate Data
    const data = useMemo(() => {
        return generateCalendarData(config, holidays, year);
    }, [config, holidays, year]);

    const handleCellClick = (cellData: { date: string; events: CalendarEvent[]; holiday?: Holiday }, pos: { x: number; y: number }) => {
        setTooltipData(cellData);
        setTooltipPos(pos);
    };

    const handleRecalculate = () => {
        setConfig({ ...config });
    };

    const handleTrace = (targetDate: string) => {
        setTooltipData(null);
        setFlashingCell(targetDate);

        setTimeout(() => {
            setFlashingCell(null);
        }, 2000);
    };

    const handleHolidayHover = (holidayData: { date: string; events: CalendarEvent[]; holiday: Holiday }, pos: { x: number; y: number }) => {
        setTooltipData(holidayData);
        setTooltipPos(pos);
    };

    const handleHolidayLeave = () => {
        setTooltipData(null);
    };

    const handleHoverChange = (hoverData: { monthIndex: number; columnIndex: number } | null) => {
        if (hoverData === null) {
            setHoveredMonth(null);
            setHoveredColumn(null);
        } else {
            const { monthIndex, columnIndex } = hoverData;
            setHoveredMonth((prev) => (prev !== monthIndex ? monthIndex : prev));
            setHoveredColumn((prev) => (prev !== columnIndex ? columnIndex : prev));
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 overflow-hidden font-sans text-gray-900">
            <Header student={student} />

            <Legend
                showSundays={showSundays}
                onToggleSundays={setShowSundays}
                onRecalculate={handleRecalculate}
                year={year}
                onYearChange={setYear}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <MonthsSidebar year={year} hoveredMonth={hoveredMonth} />
                <CalendarGrid
                    data={data}
                    year={year}
                    config={config}
                    holidays={holidays}
                    onCellClick={handleCellClick}
                    showSundays={showSundays}
                    onHoverChange={handleHoverChange}
                    hoveredColumn={hoveredColumn}
                    hoveredMonth={hoveredMonth}
                    flashingCell={flashingCell}
                    onHolidayHover={handleHolidayHover}
                    onHolidayLeave={handleHolidayLeave}
                />
            </div>

            {tooltipData && tooltipPos && (
                <Tooltip
                    data={tooltipData}
                    position={tooltipPos}
                    onClose={() => setTooltipData(null)}
                    onTrace={handleTrace}
                />
            )}
        </div>
    );
};

export default CalendarPage;
