import React, { useState } from "react";
import { format, parse, isValid, isAfter, isBefore } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Header from "../layouts/Header";

interface HeaderProps {
    year: number;
    onYearChange: (year: number) => void;
    onSearchDate: (result: { flashingDates: string[], rangeDates: string[] }) => void;
}

const CalendarHeader: React.FC<HeaderProps> = ({ year, onYearChange, onSearchDate }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const MIN_YEAR = 1900;
    const [yearInput, setYearInput] = useState(year.toString());

    // Sync input when year prop changes
    React.useEffect(() => {
        setYearInput(year.toString());
    }, [year]);

    const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length > 4) return;

        setYearInput(value);

        if (value.length === 4) {
            const newYear = parseInt(value);
            if (newYear >= MIN_YEAR) {
                onYearChange(newYear);
            }
        }
    };

    const handleYearBlur = () => {
        const currentVal = parseInt(yearInput);
        if (yearInput.length !== 4 || isNaN(currentVal) || currentVal < MIN_YEAR) {
            setYearInput(year.toString());
        }
    };

    const handleYearArrow = (direction: number) => {
        const currentVal = parseInt(yearInput);
        const isValidInput = yearInput.length === 4 && !isNaN(currentVal) && currentVal >= MIN_YEAR;

        if (!isValidInput) {
            // Reset to current valid year
            setYearInput(year.toString());
        } else {
            // Navigate
            onYearChange(year + direction);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow digits, slash, comma, hyphen, and space
        const rawValue = e.target.value.replace(/[^\d/,\- ]/g, "");

        // Split by delimiters to process each date part individually
        const parts = rawValue.split(/([,-])/);

        const maskedParts = parts.map(part => {
            // If it's a delimiter, return as is
            if (part === ',' || part === '-') return part;

            // Preserve leading/trailing spaces
            const prefix = part.match(/^\s*/)?.[0] || "";
            const suffix = part.match(/\s*$/)?.[0] || "";

            // Extract digits only
            let digits = part.replace(/\D/g, "");
            if (digits.length > 8) digits = digits.slice(0, 8);

            let masked = digits;
            if (digits.length >= 5) {
                masked = digits.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
            } else if (digits.length >= 3) {
                masked = digits.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
            }

            return prefix + masked + suffix;
        });

        setSearchQuery(maskedParts.join(""));
    };

    const parseDate = (dateStr: string): string | null => {
        const cleanStr = dateStr.trim();
        // Try DD/MM/YYYY
        const parsed = parse(cleanStr, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) {
            return format(parsed, 'yyyy-MM-dd');
        }
        // Try DD/MM (assume current year)
        const parsedShort = parse(cleanStr, 'dd/MM', new Date());
        if (isValid(parsedShort)) {
            // If year is missing, assume the current selected year from props, or current year
            // Here we use the year from props to make it context-aware
            const withYear = new Date(year, parsedShort.getMonth(), parsedShort.getDate());
            return format(withYear, 'yyyy-MM-dd');
        }
        return null;
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        const flashingDates: string[] = [];
        const rangeDates: string[] = [];

        // Split by comma to get distinct parts (dates or ranges)
        const parts = searchQuery.split(',');

        parts.forEach(part => {
            if (part.includes('-')) {
                // It's a range
                const [startStr, endStr] = part.split('-');
                const start = parseDate(startStr);
                const end = parseDate(endStr);

                if (start && end) {
                    let startDate = new Date(start + "T12:00:00");
                    let endDate = new Date(end + "T12:00:00");

                    // Ensure start is before end
                    if (isAfter(startDate, endDate)) {
                        const temp = startDate;
                        startDate = endDate;
                        endDate = temp;
                    }

                    const current = new Date(startDate);
                    while (current <= endDate || isBefore(current, endDate)) { // Safety check
                        rangeDates.push(format(current, 'yyyy-MM-dd'));
                        current.setDate(current.getDate() + 1);
                        if (current > endDate) break; // Double safety
                    }
                }
            } else {
                // It's a single date
                const date = parseDate(part);
                if (date) {
                    flashingDates.push(date);
                }
            }
        });

        if (flashingDates.length > 0 || rangeDates.length > 0) {
            onSearchDate({ flashingDates, rangeDates });
        }
    };

    return (
        <Header
            title={
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">Calendário Anual</span>
                </div>
            }
        >
            {/* Sub-header Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">

                {/* Year Navigation */}
                <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => handleYearArrow(-1)}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <input
                        type="text"
                        value={yearInput}
                        onChange={handleYearInputChange}
                        onBlur={handleYearBlur}
                        className="w-16 py-1 text-xl font-bold text-slate-800 text-center bg-transparent outline-none tabular-nums tracking-tight"
                    />
                    <button
                        onClick={() => handleYearArrow(1)}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Date Search */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Buscar (ex: 27/11, 01/05-05/05)"
                            className="w-full md:w-64 focus:w-full md:focus:w-[32rem] pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out shadow-sm origin-right"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shrink-0"
                    >
                        Buscar
                    </button>
                </form>
            </div>
        </Header>
    );
};

export default CalendarHeader;
