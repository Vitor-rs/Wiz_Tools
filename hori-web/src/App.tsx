import React, { useState, useCallback, useRef } from "react";
import CalendarGrid from "./components/CalendarGrid";
import type { CalendarGridHandle } from "./components/CalendarGrid";
import MonthsSidebar from "./components/MonthsSidebar";
import type { MonthsSidebarHandle } from "./components/MonthsSidebar";
import Layout from "./components/Layout";
import CalendarHeader from "./components/CalendarHeader";
import SimulationPage from "./pages/SimulationPage";
import CheckInPage from "./pages/CheckInPage";
import FichaFrequencia from "./pages/FichaFrequencia";
import { SimulationProvider, useSimulation } from "./context/SimulationContext";
import type { CalendarEvent, Holiday } from "./types/index";
import { IMMUTABLE_RULES } from "./config/rules";

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p>Em construção...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [year, setYear] = useState(2025);
  // hoveredData state removed for performance
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; content: React.ReactNode } | null>(null);
  const [flashingDates, setFlashingDates] = useState<Set<string>>(new Set());
  const [searchRangeDates, setSearchRangeDates] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState("calendar");

  const calendarRef = useRef<CalendarGridHandle>(null);
  const sidebarRef = useRef<MonthsSidebarHandle>(null);

  const { config, simulationResult, generatedClasses, specialDates } = useSimulation();

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

  const handleHoverChange = useCallback((data: { monthIndex: number | null; columnIndex: number | null } | null) => {
    // Direct communication via refs to avoid re-rendering the massive CalendarGrid
    calendarRef.current?.setHovered(data?.monthIndex ?? null, data?.columnIndex ?? null);
    sidebarRef.current?.setHovered(data?.monthIndex ?? null);
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
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    setFlashingDates(new Set([dateStr]));
    setTimeout(() => setFlashingDates(new Set()), 1000);
  };

  const handleSearchDate = (result: { flashingDates: string[], rangeDates: string[] }) => {
    // Check if we need to change year based on the first found date
    const allDates = [...result.flashingDates, ...result.rangeDates];
    if (allDates.length > 0) {
      const [y] = allDates[0].split('-').map(Number);
      if (y !== year) {
        setYear(y);
      }
    }

    setFlashingDates(new Set(result.flashingDates));
    setSearchRangeDates(new Set(result.rangeDates));

    // Clear flashing dates after animation, but keep ranges
    if (result.flashingDates.length > 0) {
      setTimeout(() => setFlashingDates(new Set()), 2000);
    }
  };

  const handleClearSelection = () => {
    setSearchRangeDates(new Set());
    setFlashingDates(new Set());
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'simulation' ? (
        <SimulationPage />
      ) : activePage === 'checkin' ? (
        <CheckInPage />
      ) : activePage === 'attendance_sheet' ? (
        <FichaFrequencia />
      ) : activePage === 'presence_launcher' ? (
        <PlaceholderPage title="Lançador de Presença" />
      ) : activePage === 'book_registration' ? (
        <PlaceholderPage title="Cadastramento de Livros" />
      ) : activePage === 'inventory' ? (
        <PlaceholderPage title="Estoque" />
      ) : (
        <>
          <CalendarHeader
            year={year}
            onYearChange={setYear}
            onSearchDate={handleSearchDate}
          />

          {/* Main Content Area - Flex container to hold Sidebar and Grid side-by-side */}
          <div className="flex flex-1 overflow-hidden relative bg-[#f5f6fa] p-[10px]">
            {/* The "Card" Container */}
            <div className="flex max-w-full max-h-full bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200">
              {/* Months Sidebar (Fixed Left) */}
              <div className="shrink-0 z-10 bg-white border-r border-gray-200 h-full">
                <MonthsSidebar
                  ref={sidebarRef}
                  year={year}
                  onHoverChange={handleHoverChange}
                  onMonthClick={handleMonthClick}
                />
              </div>

              {/* Calendar Grid (Scrollable) */}
              <div className="flex-1 overflow-hidden relative">
                <CalendarGrid
                  ref={calendarRef}
                  data={generatedClasses}
                  year={year}
                  config={config}
                  holidays={holidays}
                  onCellClick={handleCellClick}
                  showSundays={true}
                  onHoverChange={handleHoverChange}
                  flashingDates={flashingDates}
                  searchRangeDates={searchRangeDates}
                  onClearSelection={handleClearSelection}
                  onHolidayHover={handleHolidayHover}
                  onHolidayLeave={() => setTooltipData(null)}
                  simulationResult={simulationResult}
                  specialDates={specialDates}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tooltip */}
      {
        tooltipData && (
          <div
            className="fixed z-50 bg-white px-3 py-2 rounded shadow-lg border border-gray-200 pointer-events-none transform -translate-y-full -translate-x-1/2 -mt-2"
            style={{ left: tooltipData.x, top: tooltipData.y }}
          >
            {tooltipData.content}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45"></div>
          </div>
        )
      }
    </Layout >
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
