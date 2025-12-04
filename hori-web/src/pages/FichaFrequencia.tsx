import React, { useState } from 'react';
import { LogIn, LogOut, FileText } from 'lucide-react';
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
        fala: string;
        audicao: string;
        leitura: string;
        escrita: string;
        tarefa: string;
        situacaoTarefa: string;
        checkingSentences: string;
        app: string;
        engajamento: string;
    };
    teacher: string;
}

// --- Mock Data (Cleaned) ---

const generateMockData = (): AttendanceRecord[] => {
    return [
        {
            id: '1', month: 'JUN', weekNumber: 5, dayOfWeek: '2ª', date: '27/06', fullDate: '2022-06-27',
            classNumber: 1, presence: 'P', startTime: '00:12', endTime: '15:05',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '2', month: 'JUN', weekNumber: 5, dayOfWeek: '3ª', date: '28/06', fullDate: '2022-06-28',
            classNumber: 2, presence: 'P', startTime: '22:52', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '3', month: 'JUN', weekNumber: 5, dayOfWeek: '4ª', date: '29/06', fullDate: '2022-06-29',
            classNumber: 3, presence: 'F', startTime: '', endTime: '',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '4', month: 'JUN', weekNumber: 5, dayOfWeek: '5ª', date: '30/06', fullDate: '2022-06-30',
            classNumber: 4, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        // July
        {
            id: '5', month: 'JUL', weekNumber: 1, dayOfWeek: '6ª', date: '01/07', fullDate: '2022-07-01',
            classNumber: 5, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '6', month: 'JUL', weekNumber: 1, dayOfWeek: 'Sáb', date: '02/07', fullDate: '2022-07-02',
            classNumber: 6, presence: 'F', startTime: '', endTime: '',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '7', month: 'JUL', weekNumber: 2, dayOfWeek: 'Dom', date: '03/07', fullDate: '2022-07-03',
            classNumber: 7, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '8', month: 'JUL', weekNumber: 2, dayOfWeek: '2ª', date: '04/07', fullDate: '2022-07-04',
            classNumber: 8, presence: 'P', startTime: '22:55', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
        {
            id: '9', month: 'JUL', weekNumber: 2, dayOfWeek: '2ª', date: '04/07', fullDate: '2022-07-04',
            classNumber: 9, presence: 'P', startTime: '23:35', endTime: '23:55',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: '', app: '', engajamento: '' }, teacher: ''
        },
    ];
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
    const [records, setRecords] = useState<AttendanceRecord[]>(() => generateMockData());
    const [selectedStudent, setSelectedStudent] = useState('Vitor');
    const [inputDate, setInputDate] = useState<string>(getFullDate(new Date()));
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

    const handleLaunchPresence = () => {
        const dateObj = new Date(inputDate + 'T00:00:00'); // Ensure local time interpretation

        // Auto-increment class number logic
        let nextClassNumber: number = 1;
        const lastRecordWithClass = [...records].reverse().find(r => r.classNumber !== '');
        if (lastRecordWithClass && typeof lastRecordWithClass.classNumber === 'number') {
            nextClassNumber = lastRecordWithClass.classNumber + 1;
        }

        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            month: getMonthName(dateObj),
            weekNumber: getWeekOfMonth(dateObj),
            dayOfWeek: getDayOfWeek(dateObj),
            date: getFormattedDate(dateObj),
            fullDate: inputDate,
            classNumber: nextClassNumber,
            presence: 'P',
            startTime: getCurrentTime(),
            endTime: '',
            content: '',
            notes: '',
            evaluations: {
                fala: '', audicao: '', leitura: '', escrita: '', tarefa: '',
                situacaoTarefa: '', checkingSentences: '', app: '', engajamento: ''
            },
            teacher: 'Vitor' // Defaulting to Vitor as per previous context
        };

        setRecords([...records, newRecord]);
    };

    const handleAbsent = () => {
        const dateObj = new Date(inputDate + 'T00:00:00');

        // Auto-increment class number logic
        let nextClassNumber: number = 1;
        const lastRecordWithClass = [...records].reverse().find(r => r.classNumber !== '');
        if (lastRecordWithClass && typeof lastRecordWithClass.classNumber === 'number') {
            nextClassNumber = lastRecordWithClass.classNumber + 1;
        }

        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            month: getMonthName(dateObj),
            weekNumber: getWeekOfMonth(dateObj),
            dayOfWeek: getDayOfWeek(dateObj),
            date: getFormattedDate(dateObj),
            fullDate: inputDate,
            classNumber: nextClassNumber,
            presence: 'F',
            startTime: '',
            endTime: '',
            content: '',
            notes: '',
            evaluations: {
                fala: '', audicao: '', leitura: '', escrita: '', tarefa: '',
                situacaoTarefa: '', checkingSentences: '', app: '', engajamento: ''
            },
            teacher: 'Vitor'
        };

        setRecords([...records, newRecord]);
    };

    const handleExitPresence = () => {
        if (records.length === 0) return;

        const lastRecordIndex = records.length - 1;
        // Only update if the last record is a presence ('P')
        if (records[lastRecordIndex].presence !== 'P') return;

        const updatedRecords = [...records];
        updatedRecords[lastRecordIndex] = {
            ...updatedRecords[lastRecordIndex],
            endTime: getCurrentTime()
        };
        setRecords(updatedRecords);
    };

    const handleUpdateRecord = (id: string, field: keyof AttendanceRecord | string, value: string | number | boolean) => {
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

    // --- Styling Constants (Light Theme) ---
    const cellBase = "p-1 border border-gray-200 text-center text-xs h-8 align-middle text-gray-700 font-sans";
    const inputBase = "w-full h-full bg-transparent text-center focus:outline-none focus:bg-blue-50 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed font-sans";
    const headerBase = "p-[3px] border border-gray-200 font-bold bg-white text-gray-800 text-xs uppercase tracking-wider align-middle font-sans";
    const subHeaderBase = "p-[3px] border border-gray-200 font-bold bg-gray-50 text-gray-600 text-xs uppercase tracking-wider align-middle font-sans";

    // Hatched background for absent rows (Red stripes for light mode)
    const hatchedBg = "bg-[linear-gradient(45deg,rgba(255,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(255,0,0,0.05)_50%,rgba(255,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:8px_8px]";

    const getColClass = (index: number) => {
        return hoveredCol === index ? 'bg-blue-50' : '';
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
            <div className="flex-1 p-2.5 overflow-hidden font-sans">
                {/* Floating Card Container */}
                <div className="flex flex-col flex-1 bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">

                    {/* Top Controls */}
                    <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
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
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-end gap-2">
                                <button onClick={handleLaunchPresence} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-sm">Veio</button>
                                <button onClick={handleAbsent} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-sm">Faltou</button>
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
                    <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                        <table className="w-full text-sm border-collapse">
                            <thead className="sticky top-0 z-20 shadow-md bg-white">
                                {/* Top Header Row */}
                                <tr>
                                    <th colSpan={4} className={`${headerBase} border-b-0`}>DATAS</th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(4)} onMouseLeave={() => setHoveredCol(null)}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Aula</span>
                                        </div>
                                    </th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(5)} onMouseLeave={() => setHoveredCol(null)}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Comparec</span>
                                        </div>
                                    </th>
                                    <th colSpan={2} className={`${headerBase} border-b-0`}>HORÁRIO</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-[150px]`} onMouseEnter={() => setHoveredCol(8)} onMouseLeave={() => setHoveredCol(null)}>Lição / Conteúdo</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-[150px]`} onMouseEnter={() => setHoveredCol(9)} onMouseLeave={() => setHoveredCol(null)}>Observações / Anotações</th>
                                    <th colSpan={9} className={`${headerBase} border-b-0`}>AVALIAÇÕES</th>
                                    <th rowSpan={2} className={`${headerBase} min-w-20`} onMouseEnter={() => setHoveredCol(19)} onMouseLeave={() => setHoveredCol(null)}>Professor(a)</th>
                                    <th rowSpan={2} className={`${headerBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(20)} onMouseLeave={() => setHoveredCol(null)}>
                                        <div className="flex items-center justify-center h-20 w-full">
                                            <span className="-rotate-90 whitespace-nowrap">Duração</span>
                                        </div>
                                    </th>
                                </tr>
                                {/* Sub Header Row */}
                                <tr>
                                    {/* Datas Sub-columns */}
                                    <th className={`${subHeaderBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(0)} onMouseLeave={() => setHoveredCol(null)}>Mês</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>NS</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>DS</th>
                                    <th className={`${subHeaderBase} w-10 max-w-10`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>D/M</th>

                                    {/* Horário Sub-columns */}
                                    <th className={`${subHeaderBase} w-20 min-w-20`} onMouseEnter={() => setHoveredCol(6)} onMouseLeave={() => setHoveredCol(null)}>
                                        <div className="flex flex-col items-center justify-center gap-0.5">
                                            <span className="text-[9px]">Entrada</span>
                                            <LogIn size={12} />
                                        </div>
                                    </th>
                                    <th className={`${subHeaderBase} w-20 min-w-20`} onMouseEnter={() => setHoveredCol(7)} onMouseLeave={() => setHoveredCol(null)}>
                                        <div className="flex flex-col items-center justify-center gap-0.5">
                                            <span className="text-[9px]">Saída</span>
                                            <LogOut size={12} />
                                        </div>
                                    </th>

                                    {/* Avaliações Sub-columns - Fixed Widths */}
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(10)} onMouseLeave={() => setHoveredCol(null)}>F</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(11)} onMouseLeave={() => setHoveredCol(null)}>A</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(12)} onMouseLeave={() => setHoveredCol(null)}>L</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(13)} onMouseLeave={() => setHoveredCol(null)}>E</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(14)} onMouseLeave={() => setHoveredCol(null)}>TRF</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(15)} onMouseLeave={() => setHoveredCol(null)}>S.T</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(16)} onMouseLeave={() => setHoveredCol(null)}>CS</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(17)} onMouseLeave={() => setHoveredCol(null)}>APP</th>
                                    <th className={`${subHeaderBase} w-8 min-w-8`} onMouseEnter={() => setHoveredCol(18)} onMouseLeave={() => setHoveredCol(null)}>AL</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 bg-white">
                                {records.map((row) => (
                                    <tr key={row.id} className={`hover:bg-blue-50 transition-colors border-b border-gray-200 ${row.presence === 'F' ? hatchedBg : ''}`}>
                                        <td className={`${cellBase} ${getColClass(0)}`} onMouseEnter={() => setHoveredCol(0)} onMouseLeave={() => setHoveredCol(null)}>{row.month}</td>
                                        <td className={`${cellBase} ${getColClass(1)}`} onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)}>{row.weekNumber}</td>
                                        <td className={`${cellBase} ${getColClass(2)}`} onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)}>{row.dayOfWeek}</td>
                                        <td className={`${cellBase} ${getColClass(3)}`} onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)}>{row.date}</td>
                                        <td className={`${cellBase} ${getColClass(4)} font-medium text-gray-900`} onMouseEnter={() => setHoveredCol(4)} onMouseLeave={() => setHoveredCol(null)}>
                                            {row.classNumber}
                                        </td>
                                        <td className={`${cellBase} ${getColClass(5)}`} onMouseEnter={() => setHoveredCol(5)} onMouseLeave={() => setHoveredCol(null)}>
                                            {row.presence === 'P' && <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>}
                                            {row.presence === 'F' && <div className="w-3 h-3 rounded-full bg-red-500 mx-auto"></div>}
                                            {row.presence === 'X' && <div className="w-3 h-3 rounded-full bg-slate-300 mx-auto"></div>}
                                        </td>
                                        <td className={`${cellBase} text-[10px] ${getColClass(6)}`} onMouseEnter={() => setHoveredCol(6)} onMouseLeave={() => setHoveredCol(null)}>{row.startTime}</td>
                                        <td className={`${cellBase} text-[10px] ${getColClass(7)}`} onMouseEnter={() => setHoveredCol(7)} onMouseLeave={() => setHoveredCol(null)}>
                                            {row.endTime}
                                        </td>
                                        <td className={`${cellBase} ${getColClass(8)}`} onMouseEnter={() => setHoveredCol(8)} onMouseLeave={() => setHoveredCol(null)}>
                                            <input
                                                type="text"
                                                className={`${inputBase} text-left px-1`}
                                                value={row.content}
                                                onChange={(e) => handleUpdateRecord(row.id, 'content', e.target.value)}
                                                readOnly={row.presence === 'F'}
                                                disabled={row.presence === 'F'}
                                            />
                                        </td>
                                        <td className={`${cellBase} ${getColClass(9)}`} onMouseEnter={() => setHoveredCol(9)} onMouseLeave={() => setHoveredCol(null)}>
                                            <input
                                                type="text"
                                                className={`${inputBase} text-left px-1`}
                                                value={row.notes}
                                                onChange={(e) => handleUpdateRecord(row.id, 'notes', e.target.value)}
                                                readOnly={row.presence === 'F'}
                                                disabled={row.presence === 'F'}
                                            />
                                        </td>

                                        {/* Evaluations Inputs */}
                                        <td className={`${cellBase} ${getColClass(10)}`} onMouseEnter={() => setHoveredCol(10)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.fala} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.fala', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(11)}`} onMouseEnter={() => setHoveredCol(11)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.audicao} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.audicao', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(12)}`} onMouseEnter={() => setHoveredCol(12)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.leitura} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.leitura', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(13)}`} onMouseEnter={() => setHoveredCol(13)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.escrita} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.escrita', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(14)}`} onMouseEnter={() => setHoveredCol(14)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.tarefa} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.tarefa', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(15)}`} onMouseEnter={() => setHoveredCol(15)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.situacaoTarefa} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.situacaoTarefa', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(16)}`} onMouseEnter={() => setHoveredCol(16)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.checkingSentences} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.checkingSentences', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(17)}`} onMouseEnter={() => setHoveredCol(17)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.app} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.app', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>
                                        <td className={`${cellBase} ${getColClass(18)}`} onMouseEnter={() => setHoveredCol(18)} onMouseLeave={() => setHoveredCol(null)}><input type="text" className={inputBase} value={row.evaluations.engajamento} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.engajamento', e.target.value)} readOnly={row.presence === 'F'} disabled={row.presence === 'F'} /></td>

                                        <td className={`${cellBase} ${getColClass(19)}`} onMouseEnter={() => setHoveredCol(19)} onMouseLeave={() => setHoveredCol(null)}>
                                            <input
                                                type="text"
                                                className={inputBase}
                                                value={row.teacher}
                                                onChange={(e) => handleUpdateRecord(row.id, 'teacher', e.target.value)}
                                                readOnly={row.presence === 'F'}
                                                disabled={row.presence === 'F'}
                                            />
                                        </td>
                                        <td className={`${cellBase} text-[10px] ${getColClass(20)}`} onMouseEnter={() => setHoveredCol(20)} onMouseLeave={() => setHoveredCol(null)}>
                                            {calculateDuration(row.startTime, row.endTime)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default FichaFrequencia;
