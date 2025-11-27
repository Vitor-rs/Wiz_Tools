import React, { useState, useCallback } from "react";
import CalendarGrid from "./components/CalendarGrid";
import MonthsSidebar from "./components/MonthsSidebar";
import Layout from "./components/Layout";
import Header from "./components/Header";
import SimulationPage from "./pages/SimulationPage";
import { SimulationProvider, useSimulation } from "./context/SimulationContext";
import type { CalendarEvent, Holiday } from "./types/index";
import { IMMUTABLE_RULES } from "./config/rules";

// Mock Data (can be replaced or merged with simulation)
const MOCK_DATA: CalendarEvent[] = [];

const AppContent: React.FC = () => {
  const [year, setYear] = useState(2025);
  const [hoveredData, setHoveredData] = useState<{ monthIndex: number; columnIndex: number } | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: React.ReactNode } | null>(null);
  const [flashingCell, setFlashingCell] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("calendar");

  const { config, simulationResult } = useSimulation();

  // Use holidays from rules
  const holidays: Holiday[] = IMMUTABLE_RULES.holidays.map(h => ({
    date: h.date,
    name: h.name,
    type: h.type
  }));

  const handleCellClick = () => {
    // console.log("Cell clicked:", data);
    // Implement click logic if needed
  };

  const handleHoverChange = useCallback((data: { monthIndex: number; columnIndex: number } | null) => {
    setHoveredData(data);
  }, []);

  const handleHolidayHover = (data: { date: string; events: CalendarEvent[]; holiday: Holiday }, pos: { x: number; y: number }) => {
    setTooltipData({
      x: pos.x,
      y: pos.y,
      content: (
        <div className="text-sm">
          <div className="font-bold text-red-600">{data.holiday.name}</div>
          <div className="text-gray-500">{data.holiday.type}</div>
        </div>
      )
    });
  };

  const handleMonthClick = (monthIndex: number) => {
    const dateStr = `${ year } -${ String(monthIndex + 1).padStart(2, '0') }-01`;
    setFlashingCell(dateStr);
    setTimeout(() => setFlashingCell(null), 1000);
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'simulation' ? (
        <SimulationPage />
      ) : (
        <>
          <Header
            student={{ name: "Vitor", level: "Avançado" }}
            year={year}
            onYearChange={setYear}
            onConfigClick={() => setActivePage('simulation')}
          />

          {/* Main Content Area - Flex container to hold Sidebar and Grid side-by-side */}
          <div className="flex flex-1 overflow-hidden relative bg-gray-50">
            {/* Months Sidebar (Fixed Left) */}
            <div className="flex-shrink-0 z-10 bg-white border-r border-gray-200 h-full">
                <MonthsSidebar
                    year={year}
                    hoveredMonth={hoveredData?.monthIndex ?? null}
                    onMonthClick={handleMonthClick}
                />
            </div>

            {/* Calendar Grid (Scrollable) */}
            <div className="flex-1 overflow-hidden relative">
              <CalendarGrid
                data={MOCK_DATA}
                year={year}
                config={config}
                holidays={holidays}
                onCellClick={handleCellClick}
                showSundays={true}
                onHoverChange={handleHoverChange}
                flashingCell={flashingCell}
                onHolidayHover={handleHolidayHover}
                onHolidayLeave={() => setTooltipData(null)}
                simulationResult={simulationResult}
              />
            </div>
          </div>
        </>
      )}

      {/* Tooltip */}
      {tooltipData && (
        <div
          className="fixed z-50 bg-white px-3 py-2 rounded shadow-lg border border-gray-200 pointer-events-none transform -translate-y-full -translate-x-1/2 mt-[-8px]"
          style={{ left: tooltipData.x, top: tooltipData.y }}
        >
          {tooltipData.content}
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45"></div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
};

export default App;
