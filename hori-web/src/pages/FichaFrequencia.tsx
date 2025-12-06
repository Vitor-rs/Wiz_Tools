import React, { useState } from 'react';
import { FileText, ArrowUp, AlertTriangle, User, ArrowLeft, ArrowRight, Coffee } from 'lucide-react';
import Header from '../layouts/Header';
import PageContainer from '../layouts/PageContainer';

// --- Types ---

interface AttendanceRecord {
    id: string;
    month: string;
    weekNumber: number;
    dayOfWeek: string;
    date: string;
    fullDate: string;
    classNumber: number | '';
    presence: 'P' | 'F' | 'X';
    startTime: string;
    endTime: string;
    content: string;
    notes: string;
    evaluations: {
        fala: 'R' | 'B' | 'MB' | 'Ó' | '';
        audicao: 'R' | 'B' | 'MB' | 'Ó' | '';
        leitura: 'R' | 'B' | 'MB' | 'Ó' | '';
        escrita: 'R' | 'B' | 'MB' | 'Ó' | '';
        tarefa: 'R' | 'B' | 'MB' | 'Ó' | '';
        situacaoTarefa: 'Atrasado' | 'Em dia' | '';
        checkingSentences: 'Atenção' | 'Ok' | '';
        app: 'Atenção' | 'Ok' | '';
        engajamento: number | '';
    };
    isMakeup?: boolean;
    teachers: string[];
    isHoliday?: boolean;
    holidayName?: string;
}

// --- Constants & Config ---

const TEACHER_CONFIG: Record<string, { color: string; initials: string; }> = {
    'Vitor': { color: 'bg-blue-600', initials: 'VI' },
    'Williams': { color: 'bg-emerald-600', initials: 'WI' },
    'Maria C.': { color: 'bg-pink-500', initials: 'MC' },
};

// --- Helper Functions ---

const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '';
    try {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return '';

        let diffM = (endH * 60 + endM) - (startH * 60 + startM);
        if (diffM < 0) diffM += 24 * 60; // Handle crossing midnight

        const hours = Math.floor(diffM / 60);
        const minutes = diffM % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch {
        return '';
    }
};

const calculateMinutesBetween = (start: string, end: string): number => {
    if (!start || !end || start === 'x' || end === 'x') return 0;
    try {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return 0;

        const diff = (endH * 60 + endM) - (startH * 60 + startM);
        return diff;
    } catch {
        return 0;
    }
};

const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const getMonthName = (date: Date) => {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[date.getMonth()];
};

const getDayOfWeek = (date: Date) => {
    const days = ['Dom', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sáb'];
    return days[date.getDay()];
};

const getFormattedDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getFullDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const getWeekOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const offsetDate = date.getDate() + dayOfWeek - 1;
    return Math.floor(offsetDate / 7) + 1;
};

// --- Component ---

const FichaFrequencia: React.FC = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([
        {
            id: '1', month: 'OUT', weekNumber: 1, dayOfWeek: '4ª', date: '01/10', fullDate: '2025-10-01', classNumber: 1, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Intro', notes: '',
            evaluations: { fala: 'B', audicao: 'B', leitura: 'R', escrita: 'R', tarefa: 'B', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 3 }, teachers: ['Vitor']
        },
        {
            id: '2', month: 'OUT', weekNumber: 2, dayOfWeek: '2ª', date: '06/10', fullDate: '2025-10-06', classNumber: 2, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Lesson 1', notes: '',
            evaluations: { fala: 'MB', audicao: 'B', leitura: 'B', escrita: 'B', tarefa: 'MB', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 4 }, teachers: ['Vitor', 'Williams']
        },
        {
            id: '3', month: 'OUT', weekNumber: 2, dayOfWeek: '4ª', date: '08/10', fullDate: '2025-10-08', classNumber: 3, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Lesson 2', notes: '',
            evaluations: { fala: 'Ó', audicao: 'MB', leitura: 'MB', escrita: 'B', tarefa: 'Ó', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 5 }, teachers: ['Maria C.']
        },
        {
            id: '4', month: 'OUT', weekNumber: 3, dayOfWeek: '2ª', date: '13/10', fullDate: '2025-10-13', classNumber: 4, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Grammar', notes: 'Dificuldade em verbos',
            evaluations: { fala: 'B', audicao: 'B', leitura: 'R', escrita: 'R', tarefa: 'R', situacaoTarefa: 'Atrasado', checkingSentences: 'Atenção', app: 'Ok', engajamento: 2 }, teachers: ['Vitor']
        },
        {
            id: '5', month: 'OUT', weekNumber: 3, dayOfWeek: '4ª', date: '15/10', fullDate: '2025-10-15', classNumber: 5, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Lesson 3', notes: '',
            evaluations: { fala: 'MB', audicao: 'B', leitura: 'B', escrita: 'B', tarefa: 'MB', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Atenção', engajamento: 3 }, teachers: ['Williams']
        },
        {
            id: '6', month: 'OUT', weekNumber: 4, dayOfWeek: '2ª', date: '20/10', fullDate: '2025-10-20', classNumber: 6, presence: 'F', startTime: 'x', endTime: 'x', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '7', month: 'OUT', weekNumber: 4, dayOfWeek: '4ª', date: '22/10', fullDate: '2025-10-22', classNumber: 6, presence: 'P', isMakeup: true, startTime: '13:00', endTime: '14:00', content: 'Review', notes: 'Reposição da aula 6',
            evaluations: { fala: 'B', audicao: 'B', leitura: 'R', escrita: 'R', tarefa: 'B', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 3 }, teachers: ['Maria C.', 'Vitor']
        },
        {
            id: '8', month: 'OUT', weekNumber: 4, dayOfWeek: '4ª', date: '22/10', fullDate: '2025-10-22', classNumber: 7, presence: 'P', startTime: '14:00', endTime: '15:00', content: 'Lesson 4', notes: '',
            evaluations: { fala: 'Ó', audicao: 'MB', leitura: 'MB', escrita: 'B', tarefa: 'Ó', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 5 }, teachers: ['Vitor']
        },
        {
            id: '9', month: 'OUT', weekNumber: 5, dayOfWeek: '2ª', date: '27/10', fullDate: '2025-10-27', classNumber: 8, presence: 'P', startTime: '13:00', endTime: '14:00', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '10', month: 'OUT', weekNumber: 5, dayOfWeek: '4ª', date: '29/10', fullDate: '2025-10-29', classNumber: 10, presence: 'P', startTime: '13:00', endTime: '14:00', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '11', month: 'NOV', weekNumber: 2, dayOfWeek: '2ª', date: '03/11', fullDate: '2025-11-03', classNumber: 11, presence: 'P', startTime: '13:00', endTime: '14:00', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '12', month: 'NOV', weekNumber: 2, dayOfWeek: '4ª', date: '05/11', fullDate: '2025-11-05', classNumber: 12, presence: 'P', startTime: '13:00', endTime: '14:00', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '13', month: 'NOV', weekNumber: 3, dayOfWeek: '2ª', date: '10/11', fullDate: '2025-11-10', classNumber: 13, presence: 'F', startTime: 'x', endTime: 'x', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '14', month: 'NOV', weekNumber: 3, dayOfWeek: '4ª', date: '12/11', fullDate: '2025-11-12', classNumber: 13, presence: 'P', isMakeup: true, startTime: '13:00', endTime: '13:58', content: '', notes: 'Reposição',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Williams']
        },
        {
            id: '15', month: 'NOV', weekNumber: 3, dayOfWeek: '4ª', date: '12/11', fullDate: '2025-11-12', classNumber: 14, presence: 'P', startTime: '14:06', endTime: '15:00', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '16', month: 'NOV', weekNumber: 4, dayOfWeek: '2ª', date: '17/11', fullDate: '2025-11-17', classNumber: 15, presence: 'F', startTime: 'x', endTime: 'x', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: '17', month: 'NOV', weekNumber: 4, dayOfWeek: '4ª', date: '19/11', fullDate: '2025-11-19', classNumber: 16, presence: 'F', startTime: 'x', endTime: 'x', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Vitor']
        },
        {
            id: 'holiday-1', month: 'NOV', weekNumber: 4, dayOfWeek: '5ª', date: '20/11', fullDate: '2025-11-20', classNumber: '', presence: 'X', startTime: '', endTime: '', content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: [], isHoliday: true, holidayName: 'CONSCIÊNCIA NEGRA'
        },
        {
            id: '18', month: 'NOV', weekNumber: 4, dayOfWeek: '6ª', date: '21/11', fullDate: '2025-11-21', classNumber: 15, presence: 'P', isMakeup: true, startTime: '13:00', endTime: '14:00', content: '', notes: 'Reposição',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Maria C.']
        },
        {
            id: '19', month: 'NOV', weekNumber: 4, dayOfWeek: 'Sáb', date: '22/11', fullDate: '2025-11-22', classNumber: 16, presence: 'P', isMakeup: true, startTime: '08:00', endTime: '09:00', content: '', notes: 'Reposição',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teachers: ['Williams']
        },
        {
            id: '20', month: 'NOV', weekNumber: 5, dayOfWeek: '2ª', date: '24/11', fullDate: '2025-11-24', classNumber: 17, presence: 'P', startTime: '13:00', endTime: '14:00', content: 'Lesson 5', notes: '',
            evaluations: { fala: 'MB', audicao: 'MB', leitura: 'Ó', escrita: 'MB', tarefa: 'Ó', situacaoTarefa: 'Em dia', checkingSentences: 'Ok', app: 'Ok', engajamento: 5 }, teachers: ['Vitor', 'Williams']
        }
    ]);
    const [selectedStudent, setSelectedStudent] = useState('Vitor');
    const [inputDate, setInputDate] = useState<string>(getFullDate(new Date()));
    const [inputClassNumber, setInputClassNumber] = useState<string>('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    
    // Crosshair Refs (4 bars + 1 cell border)
    const crosshairTopRef = React.useRef<HTMLDivElement>(null);
    const crosshairBottomRef = React.useRef<HTMLDivElement>(null);
    const crosshairLeftRef = React.useRef<HTMLDivElement>(null);
    const crosshairRightRef = React.useRef<HTMLDivElement>(null);
    const cellBorderRef = React.useRef<HTMLDivElement>(null);

    const cellMetrics = React.useRef({
        rowTop: 0,
        rowHeight: 0,
        rowWidth: 0,
        colLeft: 0,
        colWidth: 0,
        tableHeight: 0,
        monthColWidth: 0
    });

    const handleScroll = () => {
        if (tableContainerRef.current) {
            const { scrollTop } = tableContainerRef.current;
            setShowScrollTop(scrollTop > 300);
        }
    };

    const updateCrosshair = () => {
        const { rowTop, rowHeight, rowWidth, colLeft, colWidth, tableHeight, monthColWidth } = cellMetrics.current;
        
        // Vertical Top
        if (crosshairTopRef.current) {
            crosshairTopRef.current.style.display = 'block';
            crosshairTopRef.current.style.left = `${colLeft}px`;
            crosshairTopRef.current.style.width = `${colWidth}px`;
            crosshairTopRef.current.style.top = '0px';
            crosshairTopRef.current.style.height = `${rowTop}px`;
        }
        // Vertical Bottom
        if (crosshairBottomRef.current) {
            crosshairBottomRef.current.style.display = 'block';
            crosshairBottomRef.current.style.left = `${colLeft}px`;
            crosshairBottomRef.current.style.width = `${colWidth}px`;
            crosshairBottomRef.current.style.top = `${rowTop + rowHeight}px`;
            crosshairBottomRef.current.style.height = `${Math.max(0, tableHeight - (rowTop + rowHeight))}px`;
        }
        // Horizontal Left
        if (crosshairLeftRef.current) {
            crosshairLeftRef.current.style.display = 'block';
            crosshairLeftRef.current.style.top = `${rowTop}px`;
            crosshairLeftRef.current.style.height = `${rowHeight}px`;
            crosshairLeftRef.current.style.left = `${monthColWidth}px`;
            crosshairLeftRef.current.style.width = `${Math.max(0, colLeft - monthColWidth)}px`;
        }
        // Horizontal Right
        if (crosshairRightRef.current) {
            crosshairRightRef.current.style.display = 'block';
            crosshairRightRef.current.style.top = `${rowTop}px`;
            crosshairRightRef.current.style.height = `${rowHeight}px`;
            crosshairRightRef.current.style.left = `${colLeft + colWidth}px`;
            crosshairRightRef.current.style.width = `${Math.max(0, rowWidth - (colLeft + colWidth))}px`;
        }
        // Cell Border
        if (cellBorderRef.current) {
            cellBorderRef.current.style.display = 'block';
            cellBorderRef.current.style.top = `${rowTop}px`;
            cellBorderRef.current.style.left = `${colLeft}px`;
            cellBorderRef.current.style.width = `${colWidth}px`;
            cellBorderRef.current.style.height = `${rowHeight}px`;
        }
    };

    const handleRowEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (tableContainerRef.current) {
            const tr = e.currentTarget;
            const top = tr.offsetTop;
            const height = tr.offsetHeight;
            const width = tr.offsetWidth;

            // Exclude first column (Month) from crosshair
            const firstCell = tr.firstElementChild as HTMLElement;
            const leftOffset = firstCell ? firstCell.offsetWidth : 0;

            cellMetrics.current.rowTop = top;
            cellMetrics.current.rowHeight = height;
            cellMetrics.current.rowWidth = width;
            cellMetrics.current.monthColWidth = leftOffset;
            
            updateCrosshair();
        }
    };

    const handleColEnter = (e: React.MouseEvent<HTMLTableCellElement>) => {
        if (tableContainerRef.current) {
            const td = e.currentTarget;
            const left = td.offsetLeft;
            const width = td.offsetWidth;
            const tableHeight = tableContainerRef.current.scrollHeight || 0;

            cellMetrics.current.colLeft = left;
            cellMetrics.current.colWidth = width;
            cellMetrics.current.tableHeight = tableHeight;

            updateCrosshair();
        }
    };

    const handleMouseLeave = () => {
        [crosshairTopRef, crosshairBottomRef, crosshairLeftRef, crosshairRightRef, cellBorderRef].forEach(ref => {
            if (ref.current) ref.current.style.display = 'none';
        });
    };

    const scrollToTop = () => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLaunchPresence = () => {
        const dateObj = new Date(inputDate + 'T00:00:00');

        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            month: getMonthName(dateObj),
            weekNumber: getWeekOfMonth(dateObj),
            dayOfWeek: getDayOfWeek(dateObj),
            date: getFormattedDate(dateObj),
            fullDate: inputDate,
            classNumber: Number(inputClassNumber),
            presence: 'P',
            startTime: getCurrentTime(),
            endTime: '',
            content: '',
            notes: '',
            evaluations: {
                fala: '', audicao: '', leitura: '', escrita: '', tarefa: '',
                situacaoTarefa: '', checkingSentences: '', app: '', engajamento: ''
            },
            teachers: ['Vitor']
        };

        setRecords([...records, newRecord]);
    };

    const handleAbsent = () => {
        const dateObj = new Date(inputDate + 'T00:00:00');

        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            month: getMonthName(dateObj),
            weekNumber: getWeekOfMonth(dateObj),
            dayOfWeek: getDayOfWeek(dateObj),
            date: getFormattedDate(dateObj),
            fullDate: inputDate,
            classNumber: Number(inputClassNumber),
            presence: 'F',
            startTime: '',
            endTime: '',
            content: '',
            notes: '',
            evaluations: {
                fala: '', audicao: '', leitura: '', escrita: '', tarefa: '',
                situacaoTarefa: '', checkingSentences: '', app: '', engajamento: ''
            },
            teachers: ['Vitor']
        };

        setRecords([...records, newRecord]);
    };

    const handleExitPresence = () => {
        if (records.length === 0) return;

        const lastRecordIndex = records.length - 1;
        if (records[lastRecordIndex].presence !== 'P') return;

        const updatedRecords = [...records];
        updatedRecords[lastRecordIndex] = {
            ...updatedRecords[lastRecordIndex],
            endTime: getCurrentTime()
        };
        setRecords(updatedRecords);
    };

    const handleUpdateRecord = (id: string, field: string, value: string | number | boolean) => {
        const updatedRecords = records.map(record => {
            if (record.id === id) {
                if (record.presence === 'F' && field !== 'classNumber') return record;

                if (field.startsWith('evaluations.')) {
                    const evalField = field.split('.')[1] as keyof typeof record.evaluations;
                    return {
                        ...record,
                        evaluations: {
                            ...record.evaluations,
                            [evalField]: value
                        }
                    };
                }
                return { ...record, [field]: value } as AttendanceRecord;
            }
            return record;
        });
        setRecords(updatedRecords);
    };

    // --- Styling Constants ---
    const cellBase = "p-1 border-r border-b border-gray-200 text-center text-xs h-8 align-middle text-gray-700 font-sans relative";
    const inputBase = "w-full h-full bg-transparent text-center focus:outline-none focus:bg-blue-50 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed font-sans";
    const headerBase = "p-[3px] border-r border-b border-gray-200 font-bold bg-[#F9F5F0] text-gray-800 text-xs uppercase tracking-wider align-middle font-sans";
    const subHeaderBase = "p-[3px] border-r border-b border-gray-200 font-bold bg-[#FFFDF6] text-gray-600 text-xs uppercase tracking-wider align-middle font-sans";
    // Hatched Bg: Red (red-500) at 15% opacity (subtle but visible), tight spacing (4px)
    const hatchedBg = "bg-[linear-gradient(45deg,rgba(239,68,68,0.15)_25%,transparent_25%,transparent_50%,rgba(239,68,68,0.15)_50%,rgba(239,68,68,0.15)_75%,transparent_75%,transparent)] bg-[length:4px_4px]";
    const lightHatchedBg = "bg-[linear-gradient(-45deg,rgba(56,103,214,0.1)_25%,transparent_25%,transparent_50%,rgba(56,103,214,0.1)_50%,rgba(56,103,214,0.1)_75%,transparent_75%,transparent)] bg-[length:4px_4px]";

    // Solid Backgrounds for Week/Day Grouping
    // User requested solid color (approx 75% opacity feel) and bold text
    const blueGroupBg = "bg-blue-200 font-bold";
    const pinkGroupBg = "bg-fuchsia-200 font-bold";

    // Holiday Background: Horizontal lines (comb/persiana effect)
    // 1px transparent, 1px gray-200 (matching table border)
    const holidayBg = "bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,#e5e7eb_1px,#e5e7eb_2px)]";

    // --- Renderers for Evaluations ---

    const renderEvaluationSelect = (
        record: AttendanceRecord,
        field: keyof typeof record.evaluations,
        value: string
    ) => {
        if (record.presence === 'F') return null;

        const getBgColor = (val: string) => {
            switch (val) {
                case 'R': return 'bg-red-200/70 text-red-900';
                case 'B': return 'bg-yellow-200/70 text-yellow-900';
                case 'MB': return 'bg-blue-200/70 text-blue-900';
                case 'Ó': return 'bg-green-200/70 text-green-900';
                default: return 'bg-transparent';
            }
        };

        return (
            <select
                className={`w-full h-full text-center text-[10px] font-bold focus:outline-none appearance-none cursor-pointer hover:bg-gray-50 rounded-sm ${getBgColor(value)}`}
                value={value}
                onChange={(e) => handleUpdateRecord(record.id, `evaluations.${field}`, e.target.value)}
                style={{ textAlignLast: 'center' }}
            >
                <option value=""></option>
                <option value="R">R</option>
                <option value="B">B</option>
                <option value="MB">MB</option>
                <option value="Ó">Ó</option>
            </select>
        );
    };

    const renderTaskStatus = (record: AttendanceRecord) => {
        if (record.presence === 'F') return null;

        const value = record.evaluations.situacaoTarefa;

        // Custom cycle for the tri-state or dropdown
        // For simplicity and minimalism, let's use a cycle on click or small dropdown
        // User requested: Atrasado (A red), Em dia (E green/blue)

        return (
            <div
                className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => {
                    const next = value === 'Em dia' ? 'Atrasado' : value === 'Atrasado' ? '' : 'Em dia';
                    handleUpdateRecord(record.id, 'evaluations.situacaoTarefa', next);
                }}
            >
                {value === 'Atrasado' && <span className="font-bold text-red-600 flex items-center justify-center w-5 h-5 rounded-full bg-red-100/50">A</span>}
                {value === 'Em dia' && <span className="font-bold text-blue-600 flex items-center justify-center w-5 h-5 rounded-full bg-blue-100/50">E</span>}
            </div>
        );
    };

    const renderCheckAlert = (record: AttendanceRecord, field: 'checkingSentences' | 'app') => {
        if (record.presence === 'F') return null;
        const value = record.evaluations[field];

        // Toggle logic
        const toggle = () => {
            const next = value === 'Ok' ? 'Atenção' : value === 'Atenção' ? '' : 'Ok';
            handleUpdateRecord(record.id, `evaluations.${field}`, next);
        };

        return (
            <div className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100" onClick={toggle}>
                {value === 'Atenção' && <AlertTriangle size={14} className="text-amber-500 fill-amber-100" />}
                {value === 'Ok' && field === 'checkingSentences' && <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                {/* For Check Sentences, maybe just empty for success or small dot. 
                    User asked for "Triangulo de alerta" specifically for issues. */}
                {value === 'Ok' && field === 'app' && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
            </div>
        );
    };

    const renderEngagement = (record: AttendanceRecord) => {
        if (record.presence === 'F') return null;

        const getBgColor = (val: number | string) => {
            const v = Number(val);
            switch (v) {
                case 1: return 'bg-gray-600/70 text-white';
                case 2: return 'bg-red-200/70 text-red-900';
                case 3: return 'bg-yellow-200/70 text-yellow-900';
                case 4: return 'bg-blue-200/70 text-blue-900';
                case 5: return 'bg-green-200/70 text-green-900';
                default: return 'bg-transparent';
            }
        };

        return (
            <select
                className={`w-full h-full text-center text-[10px] font-bold focus:outline-none appearance-none cursor-pointer hover:bg-gray-50 rounded-sm ${getBgColor(record.evaluations.engajamento)}`}
                value={record.evaluations.engajamento}
                onChange={(e) => handleUpdateRecord(record.id, 'evaluations.engajamento', Number(e.target.value))}
                style={{ textAlignLast: 'center' }}
            >
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        );
    };

    const renderTeachers = (record: AttendanceRecord) => {
        if (record.presence === 'F') return null;

        return (
            <div className="flex flex-wrap items-center justify-center gap-1 h-full w-full p-0.5">
                {record.teachers.map((t) => {
                    const config = TEACHER_CONFIG[t] || { color: 'bg-gray-500', initials: '??' };
                    // Smaller pill: py-[1px] instead of py-0.5, text-[8.5px], reduced avatar
                    return (
                        <div key={t} className={`${config.color} text-white rounded-full flex items-center gap-1 pr-1.5 py-px shadow-sm`}>
                            {/* Avatar Circle */}
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[7px] font-bold ml-0.5 uppercase">
                                {config.initials}
                            </div>
                            <span className="text-[8.5px] font-bold leading-none translate-y-[0.5px]">{t}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <PageContainer>
            <Header
                title={
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900 font-sans">Ficha de Frequência</span>
                    </div>
                }
            />
            <div className="flex-1 p-2.5 overflow-hidden font-sans flex flex-col">
                <div className="flex flex-col flex-1 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 relative">

                    {/* Top Controls */}
                    <div className="bg-[#F9F8F6] p-4 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Aluno (a):</label>
                                <select
                                    className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 w-64 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                    <option value="Vitor">Vitor</option>
                                    <option value="Joao">João</option>
                                    <option value="Maria">Maria</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Data:</label>
                                <input
                                    type="date"
                                    className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={inputDate}
                                    onChange={(e) => setInputDate(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Aula:</label>
                                <input
                                    type="number"
                                    className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 w-20 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={inputClassNumber}
                                    onChange={(e) => setInputClassNumber(e.target.value)}
                                    placeholder="#"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={handleLaunchPresence}
                                    disabled={!inputClassNumber}
                                    className="bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-sm"
                                >
                                    Veio
                                </button>
                                <button
                                    onClick={handleAbsent}
                                    disabled={!inputClassNumber}
                                    className="bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-sm"
                                >
                                    Faltou
                                </button>
                                <button onClick={handleExitPresence} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors border border-slate-600 ml-2">Saída</button>
                            </div>

                            <div className="flex flex-col items-end text-xs text-gray-500 ml-4 border-l border-gray-200 pl-4 bg-white">
                                <div>Professor(a): <span className="font-bold text-gray-800">Vitor</span></div>
                                <div>Livro/Estágio: <span className="font-bold text-gray-800">NEXT GENERATION</span></div>
                                <div>Idioma: <span className="font-bold text-gray-800">ENGLISH</span></div>
                                <div className="flex items-center gap-1">Situação: <span className="bg-green-600 text-white px-1 rounded text-[10px] font-bold">ATIVO</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div
                        ref={tableContainerRef}
                        onScroll={handleScroll}
                        onMouseLeave={handleMouseLeave}
                        className="flex-1 overflow-auto bg-white custom-scrollbar relative t-0"
                    >
                        {/* Crosshair Overlays */}
                        <div ref={crosshairTopRef} className="absolute pointer-events-none z-10 hidden bg-gray-500/5" />
                        <div ref={crosshairBottomRef} className="absolute pointer-events-none z-10 hidden bg-gray-500/5" />
                        <div ref={crosshairLeftRef} className="absolute pointer-events-none z-10 hidden bg-gray-500/5" />
                        <div ref={crosshairRightRef} className="absolute pointer-events-none z-10 hidden bg-gray-500/5" />
                        <div ref={cellBorderRef} className="absolute pointer-events-none z-10 hidden border-2 border-gray-300" />

                        <table className="w-full text-sm border-separate border-spacing-0">
                            <thead className="sticky top-0 z-20 shadow-md bg-white">
                                <tr>
                                    <th colSpan={4} className={`${headerBase}`}>DATAS</th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Aula</span>
                                        </div>
                                    </th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Comparec</span>
                                        </div>
                                    </th>
                                    <th colSpan={2} className={`${headerBase}`}>HORÁRIO</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-[150px]`}>Lição / Conteúdo</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-[150px]`}>Observações / Anotações</th>
                                    <th colSpan={9} className={`${headerBase}`}>AVALIAÇÕES</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-20`}>Professor(a)</th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Duração</span>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    {/* Datas Sub-columns */}
                                    <th className={`${subHeaderBase.replace('bg-[#FFFDF6]', 'bg-[#3867d6]/50 text-blue-900')} w-10 max-w-10`}>Mês</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`}>NS</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`}>DS</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`}>D/M</th>

                                    {/* Horário Sub-columns */}
                                    <th className={`${subHeaderBase} w-20 min-w-20`}>
                                        <div className="flex flex-col items-center justify-center gap-0.5 text-blue-600">
                                            <span className="text-[9px]">Entrada</span>
                                            <div className="flex items-center gap-0.5">
                                                <ArrowLeft size={10} strokeWidth={3} />
                                                <User size={12} fill="currentColor" className="opacity-80" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className={`${subHeaderBase} w-20 min-w-20`}>
                                        <div className="flex flex-col items-center justify-center gap-0.5 text-orange-600">
                                            <span className="text-[9px]">Saída</span>
                                            <div className="flex items-center gap-0.5">
                                                <User size={12} fill="currentColor" className="opacity-80" />
                                                <ArrowRight size={10} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </th>

                                    {/* Avaliações Sub-columns */}
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>F</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>A</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>L</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>E</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>TRF</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>S.T</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>CS</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>APP</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`}>AL</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 bg-white">
                                {records.map((row, index) => {
                                    const isNewMonth = index > 0 && row.month !== records[index - 1].month;
                                    const topBorderClass = isNewMonth ? "border-t-[3px] border-t-blue-900" : "";
                                    const prevRow = records[index - 1];
                                    const nextRow = records[index + 1];
                                    const isFirstOfWeek = !prevRow || row.weekNumber !== prevRow.weekNumber || row.month !== prevRow.month;
                                    const isSameDateAsPrev = prevRow && row.date === prevRow.date;
                                    const isSameDateAsNext = nextRow && row.date === nextRow.date;
                                    const isMultiClassDayStart = isSameDateAsNext && !isSameDateAsPrev;
                                    const isMultiClassDayEnd = isSameDateAsPrev && !isSameDateAsNext;
                                    const isMultiClassRow = isSameDateAsPrev || isSameDateAsNext;
                                    const showMonth = index === 0 || row.month !== records[index - 1].month;
                                    const showWeek = isFirstOfWeek;
                                    const showDate = !prevRow || row.date !== prevRow.date;
                                    const nextRowIsNewWeek = nextRow && (nextRow.weekNumber !== row.weekNumber || nextRow.month !== row.month);
                                    const nextRowIsNewDate = nextRow && (nextRow.date !== row.date);

                                    const getWeekStyle = (colIndex: number) => {
                                        const shadows: string[] = [];
                                        const blue = '#60a5fa'; // blue-400
                                        const pink = '#e879f9'; // fuchsia-400
                                        let classes = "";

                                        // 1. Calculate possible Top Borders
                                        const isPinkTopNeeded = isMultiClassRow && isMultiClassDayStart && colIndex >= 2 && colIndex <= 7 && !isNewMonth;
                                        const isBlueTopNeeded = isFirstOfWeek && colIndex >= 1 && colIndex <= 7;

                                        // 2. Apply Top Borders
                                        if (isBlueTopNeeded && isPinkTopNeeded) {
                                            // Blue on top (1px)
                                            shadows.push(`inset 0 1px 0 0 ${blue}`);
                                            // White Gap (1px) - rendered by covering 0-2px with white (under blue)
                                            shadows.push(`inset 0 2px 0 0 white`);
                                            // Pink below (1px) - rendered by covering 0-3px with pink (under white)
                                            shadows.push(`inset 0 3px 0 0 ${pink}`);
                                        } else if (isBlueTopNeeded) {
                                            shadows.push(`inset 0 1px 0 0 ${blue}`);
                                        } else if (isPinkTopNeeded) {
                                            shadows.push(`inset 0 1px 0 0 ${pink}`);
                                        }

                                        // 3. Week Column background
                                        if (isFirstOfWeek && colIndex === 1) {
                                            classes += ` ${blueGroupBg}`;
                                        }

                                        // 4. Other Pink Highlights (Day Start background, internal borders)
                                        if (isMultiClassRow) {
                                            if (isMultiClassDayStart && colIndex === 2) classes += ` ${pinkGroupBg}`;

                                            if (isMultiClassDayStart && (colIndex === 2 || colIndex === 3)) shadows.push(`inset 0 -1px 0 0 ${pink}`);
                                            if (isSameDateAsPrev && colIndex === 4) shadows.push(`inset 1px 0 0 0 ${pink}`);
                                            if (isMultiClassDayEnd && colIndex >= 4 && colIndex <= 7) shadows.push(`inset 0 -1px 0 0 ${pink}`);
                                        }

                                        return { className: classes, style: shadows.length > 0 ? { boxShadow: shadows.join(', ') } : {} };
                                    };

                                    if (row.isHoliday) {
                                        const holidayBorder = "border-t border-b border-gray-400";
                                        return (
                                            <tr key={row.id} className="transition-colors" onMouseEnter={handleRowEnter}>
                                                {/* Month - No holiday border */}
                                                <td className={`${cellBase.replace('border-b', '')} bg-[#3867d6]/30 font-bold text-blue-900 ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                    {showMonth ? (row.month.charAt(0) + row.month.slice(1).toLowerCase()) : ''}
                                                </td>
                                                {/* Week - No holiday border */}
                                                {(() => {
                                                    const { className, style } = getWeekStyle(1);
                                                    const isEmpty = !showWeek;
                                                    const showGrayStripes = isEmpty;
                                                    const removeRight = isEmpty && !showDate;
                                                    const removeBottom = isEmpty && !nextRowIsNewWeek;
                                                    const borderClass = isEmpty
                                                        ? `${removeRight ? 'border-r-0' : ''} ${removeBottom ? 'border-b-0' : ''}`.trim()
                                                        : '';
                                                    return <td className={`${cellBase} ${topBorderClass} ${className} ${borderClass} ${showGrayStripes ? lightHatchedBg : ''}`} style={style} onMouseEnter={handleColEnter}>{showWeek ? row.weekNumber : ''}</td>;
                                                })()}
                                                {/* DS - Start of holiday border (add left border) */}
                                                {(() => {
                                                    const { className, style } = getWeekStyle(2);
                                                    return <td className={`${cellBase} ${holidayBg} ${topBorderClass} ${className} border-r-0 ${holidayBorder} border-l border-l-gray-400 font-bold`} style={style} onMouseEnter={handleColEnter}>{row.dayOfWeek}</td>;
                                                })()}
                                                {/* Date */}
                                                {(() => {
                                                    const { className, style } = getWeekStyle(3);
                                                    return <td className={`${cellBase} ${holidayBg} ${topBorderClass} ${className} border-r-0 ${holidayBorder} font-bold`} style={style} onMouseEnter={handleColEnter}>{row.date}</td>;
                                                })()}
                                                
                                                {/* Empty Columns (Aula, Presence, Start, End) */}
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>

                                                {/* Merged Content/Notes */}
                                                <td colSpan={2} className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder} text-center font-bold text-gray-500 uppercase tracking-widest`} onMouseEnter={handleColEnter}>
                                                    FERIADO NACIONAL: {row.holidayName}
                                                </td>

                                                {/* Empty Evaluations (9 cols) */}
                                                {Array.from({ length: 9 }).map((_, i) => (
                                                    <td key={i} className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>
                                                ))}

                                                {/* Teacher */}
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} border-r-0 ${holidayBorder}`} onMouseEnter={handleColEnter}></td>
                                                
                                                {/* Duration - End of holiday border (add right border) */}
                                                <td className={`${cellBase} ${holidayBg} ${topBorderClass} ${holidayBorder} border-r border-r-gray-400`} onMouseEnter={handleColEnter}></td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={row.id} className="transition-colors" onMouseEnter={handleRowEnter}>
                                            <td className={`${cellBase.replace('border-b', '')} bg-[#3867d6]/30 font-bold text-blue-900 ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {showMonth ? (row.month.charAt(0) + row.month.slice(1).toLowerCase()) : ''}
                                            </td>
                                            {(() => {
                                                const { className, style } = getWeekStyle(1);
                                                const isEmpty = !showWeek;
                                                const showGrayStripes = isEmpty;
                                                const removeRight = isEmpty && !showDate;
                                                const removeBottom = isEmpty && !nextRowIsNewWeek;
                                                const borderClass = isEmpty
                                                    ? `${removeRight ? 'border-r-0' : ''} ${removeBottom ? 'border-b-0' : ''}`.trim()
                                                    : '';
                                                return <td className={`${cellBase} ${topBorderClass} ${className} ${borderClass} ${showGrayStripes ? lightHatchedBg : ''}`} style={style} onMouseEnter={handleColEnter}>{showWeek ? row.weekNumber : ''}</td>;
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(2);
                                                const isEmpty = !showDate;
                                                const showGrayStripes = isEmpty && row.presence !== 'F';
                                                const removeRight = isEmpty;
                                                const removeBottom = isEmpty && !nextRowIsNewDate;
                                                const borderClass = isEmpty
                                                    ? `${removeRight ? 'border-r-0' : ''} ${removeBottom ? 'border-b-0' : ''}`.trim()
                                                    : '';
                                                return <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className} ${borderClass} ${showGrayStripes ? lightHatchedBg : ''}`} style={style} onMouseEnter={handleColEnter}>{showDate ? row.dayOfWeek : ''}</td>;
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(3);
                                                const isEmpty = !showDate;
                                                const showGrayStripes = isEmpty && row.presence !== 'F';
                                                const removeRight = false;
                                                const removeBottom = isEmpty && !nextRowIsNewDate;
                                                const borderClass = isEmpty
                                                    ? `${removeRight ? 'border-r-0' : ''} ${removeBottom ? 'border-b-0' : ''}`.trim()
                                                    : '';
                                                return <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className} ${borderClass} ${showGrayStripes ? lightHatchedBg : ''}`} style={style} onMouseEnter={handleColEnter}>{showDate ? row.date : ''}</td>;
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(4);
                                                return <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className} font-medium text-gray-900`} style={style} onMouseEnter={handleColEnter}>{row.classNumber}</td>;
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(5);
                                                return (
                                                    <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className}`} style={style} onMouseEnter={handleColEnter}>
                                                        {row.presence === 'P' && (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                                {row.isMakeup && <div className="w-3 h-3 rounded-full bg-yellow-400"></div>}
                                                            </div>
                                                        )}
                                                        {row.presence === 'F' && <div className="w-3 h-3 rounded-full bg-red-500 mx-auto"></div>}
                                                        {row.presence === 'X' && <div className="w-3 h-3 rounded-full bg-slate-300 mx-auto"></div>}
                                                    </td>
                                                );
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(6);
                                                return <td className={`${cellBase} text-[10px] ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className}`} style={style} onMouseEnter={handleColEnter}>{row.startTime}</td>;
                                            })()}
                                            {(() => {
                                                const { className, style } = getWeekStyle(7);
                                                const intervalMinutes = isMultiClassDayStart && nextRow ? calculateMinutesBetween(row.endTime, nextRow.startTime) : 0;

                                                return (
                                                    <td className={`${cellBase} text-[10px] ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass} ${className} relative`} style={style} onMouseEnter={handleColEnter}>
                                                        {row.endTime}
                                                        {intervalMinutes > 0 && (
                                                            <div
                                                                className="absolute z-50 flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#fdfbf7] border border-[#d6d3d1] shadow-sm group cursor-help transition-transform hover:scale-110 -translate-x-1/2 translate-y-1/2 left-0 bottom-0"
                                                                title={`Intervalo: ${intervalMinutes} min`}
                                                            >
                                                                <Coffee size={11} className="text-[#854d0e]" strokeWidth={2.5} />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })()}

                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                <input type="text" className={`${inputBase} text-left px-1`} value={row.content} onChange={(e) => handleUpdateRecord(row.id, 'content', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} />
                                            </td>
                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                <input type="text" className={`${inputBase} text-left px-1`} value={row.notes} onChange={(e) => handleUpdateRecord(row.id, 'notes', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} />
                                            </td>

                                            {/* EVALUATIONS */}
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEvaluationSelect(row, 'fala', row.evaluations.fala)}
                                            </td>
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEvaluationSelect(row, 'audicao', row.evaluations.audicao)}
                                            </td>
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEvaluationSelect(row, 'leitura', row.evaluations.leitura)}
                                            </td>
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEvaluationSelect(row, 'escrita', row.evaluations.escrita)}
                                            </td>
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEvaluationSelect(row, 'tarefa', row.evaluations.tarefa)}
                                            </td>
                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderTaskStatus(row)}
                                            </td>
                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderCheckAlert(row, 'checkingSentences')}
                                            </td>
                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderCheckAlert(row, 'app')}
                                            </td>
                                            <td className={`${cellBase.replace('p-1', 'p-0.5')} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderEngagement(row)}
                                            </td>

                                            <td className={`${cellBase} ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {renderTeachers(row)}
                                            </td>
                                            <td className={`${cellBase} text-[10px] ${row.presence === 'F' ? hatchedBg : ''} ${topBorderClass}`} onMouseEnter={handleColEnter}>
                                                {calculateDuration(row.startTime, row.endTime)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="absolute bottom-6 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 opacity-90 hover:opacity-100"
                            title="Voltar ao topo"
                        >
                            <ArrowUp size={20} />
                        </button>
                    )}
                </div>
            </div >
        </PageContainer >
    );
};

export default FichaFrequencia;
