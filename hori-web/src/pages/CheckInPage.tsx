import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, MoreHorizontal, ChevronDown, User, BookOpen, LogIn, X, Calendar } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    book: string; // Estágio
    status: 'pending' | 'present' | 'absent' | 'in_class' | 'finished';
    timeSlot: string;
    avatarColor: string;
}

const CheckInPage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    // const [selectedSlot, setSelectedSlot] = useState('13:00 - 14:00'); // Unused for now

    // Mock Data
    const [students, setStudents] = useState<Student[]>([
        { id: '1', name: 'Ana Caroline', book: 'W12', status: 'pending', timeSlot: '13:00 - 14:00', avatarColor: 'bg-purple-500' },
        { id: '2', name: 'Miguel Botelho', book: 'W12', status: 'in_class', timeSlot: '13:00 - 14:00', avatarColor: 'bg-blue-500' },
        { id: '3', name: 'Sandra Moretto', book: 'Teens 6', status: 'absent', timeSlot: '13:00 - 14:00', avatarColor: 'bg-orange-500' },
        { id: '4', name: 'Gomes', book: 'Teens 8', status: 'in_class', timeSlot: '14:00 - 15:00', avatarColor: 'bg-yellow-600' },
        { id: '5', name: 'Beatriz Silva', book: 'W4', status: 'pending', timeSlot: '14:00 - 15:00', avatarColor: 'bg-pink-500' },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleStatusChange = (id: string, newStatus: Student['status']) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: newStatus } : s
        ));
    };

    const getStatusBadge = (status: Student['status']) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">A vir</span>;
            case 'in_class':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">Em aula</span>;
            case 'absent':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">Faltou</span>;
            case 'finished':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">Concluído</span>;
            default:
                return null;
        }
    };

    // Group students by time slot
    const slots = ['13:00 - 14:00', '14:00 - 15:00'];

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Check-in</h1>
                        <p className="text-xs text-slate-400">Gerenciamento de entrada e saída</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-sm font-mono font-medium text-white">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                        Nova Entrada
                    </button>
                </div>
            </div>

            {/* Filters / Toolbar */}
            <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-800/50">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 flex-1 max-w-md">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar aluno..."
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-slate-500"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 text-sm text-slate-300 transition-colors">
                        <Filter size={16} />
                        <span>Filtros</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 text-sm text-slate-300 transition-colors">
                        <span>Entradas Recepção</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {slots.map(slot => (
                    <div key={slot} className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium px-2">
                            <ChevronDown size={16} />
                            <span>{slot}</span>
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs text-slate-500">
                                {students.filter(s => s.timeSlot === slot).length} alunos
                            </span>
                        </div>

                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-800/30 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4 flex items-center gap-2">
                                    <User size={14} />
                                    Nome
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <BookOpen size={14} />
                                    Estágio
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <LogIn size={14} />
                                    Ações
                                </div>
                                <div className="col-span-2 text-center">Status</div>
                                <div className="col-span-2 text-right">Opções</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-slate-800/50">
                                {students.filter(s => s.timeSlot === slot).map(student => (
                                    <div
                                        key={student.id}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors ${student.status === 'in_class' ? 'bg-yellow-500/5' :
                                                student.status === 'absent' ? 'bg-red-500/5' : ''
                                            }`}
                                    >
                                        {/* Name */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${student.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-slate-200">{student.name}</span>
                                        </div>

                                        {/* Book */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                                <span className="text-sm text-slate-300">{student.book}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center gap-2">
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'in_class')}
                                                disabled={student.status !== 'pending'}
                                                className={`p-1.5 rounded-lg transition-all ${student.status === 'in_class'
                                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                title="Entrada"
                                            >
                                                <LogIn size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                disabled={student.status !== 'pending'}
                                                className={`p-1.5 rounded-lg transition-all ${student.status === 'absent'
                                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                        : 'bg-slate-800 text-slate-400 hover:bg-red-600 hover:text-white'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                title="Falta"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2 flex justify-center">
                                            {getStatusBadge(student.status)}
                                        </div>

                                        {/* Options */}
                                        <div className="col-span-2 flex justify-end">
                                            <button className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckInPage;
