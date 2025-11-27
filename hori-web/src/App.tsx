import { useState, useMemo } from 'react'
import Layout from './components/Layout'
import CalendarGrid from './components/CalendarGrid'
import MonthsSidebar from './components/MonthsSidebar'
import Tooltip from './components/Tooltip'
import { generateCalendarData } from './utils/logic'
import type { Config, Holiday, CalendarEvent } from './utils/logic'

const config: Config = {
  startDate: '2024-02-01',
  monthsDuration: 12,
  days: [1, 3, 5], // Mon, Wed, Fri
  time: '14:00'
}

const holidays: Holiday[] = [
  { date: '2024-12-25', name: 'Natal' },
  { date: '2024-01-01', name: 'Ano Novo' }
]

function App() {
  const [activePage, setActivePage] = useState('calendar')
  const [year, setYear] = useState(2024)
  const [hoveredData, setHoveredData] = useState<{ monthIndex: number; columnIndex: number } | null>(null)
  const [tooltipData, setTooltipData] = useState<{ data: { date: string; events: CalendarEvent[]; holiday?: Holiday }; position: { x: number; y: number } } | null>(null)
  const [flashingCell, setFlashingCell] = useState<string | null>(null)

  const data = useMemo(() => generateCalendarData(config, holidays), [])

  const handleCellClick = (data: { date: string; events: CalendarEvent[]; holiday?: Holiday }, pos: { x: number; y: number }) => {
    setTooltipData({ data, position: pos })
  }

  const handleHolidayHover = (data: { date: string; events: CalendarEvent[]; holiday: Holiday }, pos: { x: number; y: number }) => {
    setTooltipData({ data, position: pos })
  }

  const handleTrace = (date: string) => {
    setFlashingCell(date)
    setTooltipData(null)
    setTimeout(() => setFlashingCell(null), 2000)
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <div className="flex flex-col h-full relative">
        <div className="p-4 border-b flex justify-between items-center bg-white shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Hori Calendar Web</h1>
          <div className="flex gap-2 items-center">
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={() => setYear(y => y - 1)}
            >
              &lt;
            </button>
            <span className="font-bold text-lg">{year}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              onClick={() => setYear(y => y + 1)}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          <MonthsSidebar
            year={year}
            hoveredMonth={hoveredData?.monthIndex ?? null}
            onHoverChange={(m: number | null) => setHoveredData(prev => m === null ? null : { monthIndex: m, columnIndex: prev?.columnIndex ?? -1 })}
          />
          <CalendarGrid
            data={data}
            year={year}
            config={config}
            holidays={holidays}
            onCellClick={handleCellClick}
            showSundays={true}
            onHoverChange={setHoveredData}
            hoveredColumn={hoveredData?.columnIndex ?? null}
            hoveredMonth={hoveredData?.monthIndex ?? null}
            flashingCell={flashingCell}
            onHolidayHover={handleHolidayHover}
            onHolidayLeave={() => setTooltipData(null)}
          />
        </div>

        {tooltipData && (
          <Tooltip
            data={tooltipData.data}
            position={tooltipData.position}
            onClose={() => setTooltipData(null)}
            onTrace={handleTrace}
          />
        )}
      </div>
    </Layout>
  )
}

export default App
