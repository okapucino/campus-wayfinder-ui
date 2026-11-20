import React, { useEffect, useState } from 'react';
import { CAMPUS_NODES, COURSE_SCHEDULES, CourseSchedule } from '../../data/campusData';
import { getNodeById } from '../../utils/pathfinder';
import { ArrowRight, Bot, HelpCircle, Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedRoomId?: string;
  suggestedCourse?: CourseSchedule;
  suggestedParkingId?: string;
}

interface AssistantScreenProps {
  initialQuery?: string | null;
  onClearInitialQuery: () => void;
  onStartRouteToRoom: (
    roomId: string,
    course?: CourseSchedule,
    overrideStartId?: string
  ) => void;
}

const QUICK_QUESTIONS = [
  'Kelas Human Computer Interaction di mana?',
  'Parkir terdekat ke Smart Classroom 403?',
  'Lokasi Lift Kampus ada di mana?',
  'Lab Desain DKV lantai berapa?',
];

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  initialQuery,
  onClearInitialQuery,
  onStartRouteToRoom,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Saya asisten WayFinder INSTIKI. Tanyakan lokasi kelas, jadwal MatKul, lift, atau parkiran terdekat dengan bahasa santai saja.',
    },
  ]);

  const answerQuery = (rawText: string) => {
    const query = rawText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    const q = query.toLowerCase();
    let botReply: ChatMessage;

    if (q.includes('hci') || q.includes('human computer')) {
      const course = COURSE_SCHEDULES.find((c) => c.id === 'mk-hci')!;
      const room = getNodeById(course.roomId)!;
      botReply = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `Kelas Human Computer Interaction (${course.lecturer}) jadwalnya hari ${course.day} pukul ${course.startTime} di ${room.label} (Lantai ${room.floor}). Dari Parkiran Motor Depan cuma sekitar 2 menit lewat Tangga Utama!`,
        suggestedRoomId: room.id,
        suggestedCourse: course,
      };
    } else if (q.includes('lift') || q.includes('akses')) {
      botReply = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: 'Lift Kampus berada di ujung Koridor Sayap Timur pada setiap lantai (Lt. 1–4). Kamu juga bisa mengaktifkan "Mode Lift" di halaman peta agar rute menghindari tangga.',
        suggestedRoomId: 'f1-lift',
      };
    } else if (q.includes('403') || q.includes('smart')) {
      const room = getNodeById('f4-smart403')!;
      botReply = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `${room.label} ada di Lantai 4 Sayap Timur Utara. Paling dekat kalau parkir di Parkiran Motor Belakang lalu naik lewat Tangga Utara, atau naik Lift dari Lobi!`,
        suggestedRoomId: room.id,
        suggestedParkingId: 'parkir-belakang',
      };
    } else if (q.includes('dkv') || q.includes('desain')) {
      const room = getNodeById('f3-lab-dkv')!;
      botReply = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `${room.label} berada di Lantai 3 Sayap Timur Utara (${room.landmark}). Mau saya bukakan rutenya dari parkiran?`,
        suggestedRoomId: room.id,
      };
    } else {
      // Search courses or rooms dynamically
      const matchedCourse = COURSE_SCHEDULES.find(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );
      const matchedRoom = CAMPUS_NODES.find(
        (n) =>
          (n.kind === 'room' || n.kind === 'facility') &&
          (n.label.toLowerCase().includes(q) ||
            (n.shortLabel?.toLowerCase().includes(q) ?? false))
      );

      if (matchedCourse) {
        const room = getNodeById(matchedCourse.roomId)!;
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: `MatKul ${matchedCourse.name} berlangsung hari ${matchedCourse.day} (${matchedCourse.startTime}) di ${room.label}, Lantai ${room.floor}.`,
          suggestedRoomId: room.id,
          suggestedCourse: matchedCourse,
        };
      } else if (matchedRoom) {
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: `${matchedRoom.label} ada di Lantai ${matchedRoom.floor}. Patokannya: ${matchedRoom.landmark ?? matchedRoom.description}.`,
          suggestedRoomId: matchedRoom.id,
        };
      } else {
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: 'Hmm, saya belum menemukan ruangan atau MatKul itu. Coba sebutkan nama ruangan seperti "Lab 2", "R.302", "Aula", atau nama mata kuliah seperti "HCI".',
        };
      }
    }

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput('');
  };

  useEffect(() => {
    if (initialQuery) {
      answerQuery(initialQuery);
      onClearInitialQuery();
    }
  }, [initialQuery]);

  return (
    <div className="flex flex-col h-full p-4 space-y-3 pb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#1A2352] text-amber-300 flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold text-slate-900">Tanya WayFinder (Naturalness)</h1>
          <p className="text-[11px] text-slate-500">
            Tanya lokasi kelas atau rute dengan bahasa sehari-hari
          </p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => answerQuery(q)}
            className="text-left px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#1A2352] text-[11px] font-semibold text-slate-700 transition cursor-pointer"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-2.5 flex-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user'
                  ? 'bg-[#D32F2F] text-white'
                  : 'bg-[#1A2352] text-white'
              }`}
            >
              {m.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-xs leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-[#1A2352] text-white rounded-tr-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
              }`}
            >
              <p>{m.text}</p>
              {m.suggestedRoomId && (
                <button
                  type="button"
                  onClick={() =>
                    onStartRouteToRoom(
                      m.suggestedRoomId!,
                      m.suggestedCourse,
                      m.suggestedParkingId
                    )
                  }
                  className="mt-2 w-full py-1.5 px-2.5 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Buka Rute di Peta</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          answerQuery(input);
        }}
        className="flex items-center gap-2 bg-white border border-slate-300 rounded-2xl p-1.5 shadow-xs"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya lokasi MatKul / ruangan..."
          className="flex-1 px-2.5 py-1.5 text-xs outline-none bg-transparent"
        />
        <button
          type="submit"
          aria-label="Kirim pertanyaan"
          className="w-8 h-8 rounded-xl bg-[#1A2352] hover:bg-slate-800 text-white flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Panduan Singkat Ikon Peta */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 space-y-1.5">
        <p className="text-[11px] font-extrabold text-slate-700 inline-flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#1A2352]" /> Panduan Singkat Peta
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600">
          <span>🅿️ Area Parkiran (Titik Awal)</span>
          <span>🪜 Tangga Utama / Utara</span>
          <span>🛗 Lift Kampus (Ramah Akses)</span>
          <span>📍 Ruang Kelas / Lab Tujuan</span>
        </div>
      </div>
    </div>
  );
};
