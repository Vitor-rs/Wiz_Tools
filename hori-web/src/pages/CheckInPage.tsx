import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Search, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PageHeader from '../components/PageHeader';

interface Student {
    id: string;
    name: string;
    book: string; // Estágio
    status: 'pending' | 'present' | 'absent' | 'in_class' | 'finished';
    timeSlot: string;
    avatarColor: string;
    room: string;
    professor: string;
    days: number[]; // 1=Seg, 2=Ter, etc.
}

const TIME_SLOTS = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
const WEEK_DAYS = [
    { label: '2ª', value: 1 },
    { label: '3ª', value: 2 },
    { label: '4ª', value: 3 },
    { label: '5ª', value: 4 },
    { label: '6ª', value: 5 },
    { label: 'Sáb', value: 6 },
];

const CheckInPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string>('15:00'); // Default to 15:00 for demo
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data
    const [students, setStudents] = useState<Student[]>([
        { id: '1', name: 'Vitor Ricardo Santos', book: 'Next Generation', status: 'pending', timeSlot: '15:00', avatarColor: 'bg-blue-500', room: 'Berlim', professor: 'Vitor, Willians', days: [1, 3, 5] },
        { id: '2', name: 'Ana Caroline', book: 'W12', status: 'present', timeSlot: '15:00', avatarColor: 'bg-purple-500', room: 'Londres', professor: 'Sarah', days: [2, 4] },
        { id: '3', name: 'Miguel Botelho', book: 'W12', status: 'in_class', timeSlot: '13:00', avatarColor: 'bg-indigo-500', room: 'Paris', professor: 'John', days: [1, 3] },
        { id: '4', name: 'Sandra Moretto', book: 'Teens 6', status: 'absent', timeSlot: '15:00', avatarColor: 'bg-orange-500', room: 'Madrid', professor: 'Maria', days: [1, 3, 5] },
        { id: '5', name: 'Gomes', book: 'Teens 8', status: 'pending', timeSlot: '16:00', avatarColor: 'bg-yellow-600', room: 'Tokio', professor: 'Akira', days: [2, 4] },
        { id: '6', name: 'Beatriz Silva', book: 'W4', status: 'pending', timeSlot: '15:00', avatarColor: 'bg-pink-500', room: 'Berlim', professor: 'Vitor, Willians', days: [1, 3, 5] },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);

        // Auto-select slot based on current time (simple logic)
        const hour = new Date().getHours();
        const foundSlot = TIME_SLOTS.find(slot => slot.startsWith(String(hour)));
        if (foundSlot) {
            // setSelectedSlot(foundSlot); // Uncomment to enable auto-select
        }

        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = (id: string) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, status: 'present' } : s
        ));
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSlot = student.timeSlot === selectedSlot;
            const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSlot && matchesSearch;
        });
    }, [students, selectedSlot, searchQuery]);

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans">
            <PageHeader
                title="Gerenciamento de Entrada"
                subtitle={
                    <div className="flex items-center gap-2">
                        <span className="capitalize">{format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1 font-mono text-slate-600">
                            <Clock size={14} />
                            {format(currentTime, "HH:mm")}
                        </div>
                    </div>
                }
            >
                {/* Timeline Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    <button className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    {TIME_SLOTS.map(slot => (
                        <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${selectedSlot === slot
                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                    <button className="p-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </PageHeader>

            {/* Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-bold">
                        <Check size={16} />
                        <span>Check - In</span>
                    </div>
                    <div className="px-3 py-1.5 text-slate-400 text-sm font-medium hover:text-slate-600 cursor-pointer transition-colors">
                        Presenças Hoje
                    </div>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar aluno..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100/50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <div className="col-span-4">Aluno</div>
                        <div className="col-span-2">Estágio / Modalidade</div>
                        <div className="col-span-2">Sala / Professor</div>
                        <div className="col-span-2 text-center">Dias</div>
                        <div className="col-span-2 text-center">Ações</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 italic">
                                Nenhum aluno encontrado para este horário.
                            </div>
                        ) : (
                            filteredStudents.map(student => (
                                <div key={student.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group">
                                    {/* Aluno */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${student.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{student.name}</div>
                                            <div className="text-xs text-slate-500">ID: #{student.id.padStart(4, '0')}</div>
                                        </div>
                                    </div>

                                    {/* Estágio */}
                                    <div className="col-span-2">
                                        <span className="inline-block px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                                            {student.book}
                                        </span>
                                        <div className="text-[10px] text-slate-400 mt-1 font-medium pl-1">Interactive</div>
                                    </div>

                                    {/* Sala */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                                                {student.room}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1 pl-1 truncate" title={student.professor}>
                                            {student.professor}
                                        </div>
                                    </div>

                                    {/* Dias */}
                                    <div className="col-span-2 flex justify-center gap-1">
                                        {WEEK_DAYS.map(day => (
                                            <div
                                                key={day.value}
                                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border ${student.days.includes(day.value)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-slate-50 text-slate-300 border-slate-100'
                                                    }`}
                                            >
                                                {day.label.replace('ª', '')}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Ações */}
                                    <div className="col-span-2 flex justify-center gap-2">
                                        {student.status === 'pending' ? (
                                            <button
                                                onClick={() => handleCheckIn(student.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm hover:shadow transition-all text-xs font-bold"
                                            >
                                                <Check size={14} />
                                                Entrada
                                            </button>
                                        ) : student.status === 'present' ? (
                                            <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg border border-green-200 text-xs font-bold">
                                                <Check size={14} />
                                                Presente
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 font-medium px-3 py-1.5 bg-slate-100 rounded-lg">
                                                {student.status === 'absent' ? 'Faltou' : 'Em Aula'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInPage;
