import React, { useEffect, useState } from 'react';
import {
  ALL_ROOMS,
  COURSE_SCHEDULES,
  CourseSchedule,
  getRoomById,
} from '../../data/campusData';
import { ArrowRight, Bot, HelpCircle, Send, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestedRoomId?: string;
  suggestedCourse?: CourseSchedule;
}

interface AssistantScreenProps {
  initialQuery?: string | null;
  onClearInitialQuery: () => void;
  onStartRouteToRoom: (roomId: string, course?: CourseSchedule) => void;
}

const QUICK_QUESTIONS = [
  'Dimana ruang BAAK?',
  'Kelas HCI di gedung mana?',
  'Mushola ada di gedung mana?',
  'Lokasi Lab DKV (541)?',
  'Dimana Lab Android (621)?',
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
      text: 'Halo! Saya asisten WayFinder INSTIKI. Tanyakan lokasi gedung (G1–G6), kode ruang (mis. R.541, R.213), mushola, atau jadwal MatKul dengan bahasa sehari-hari.',
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
    let botReply: ChatMessage | null = null;

    if (q.includes('hci') || q.includes('human computer')) {
      const course = COURSE_SCHEDULES.find((c) => c.id === 'mk-hci')!;
      const room = getRoomById(course.roomId)!;
      botReply = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: `Kelas Human Computer Interaction (${course.lecturer}) jadwalnya hari ${course.day} pukul ${course.startTime} di ${room.name} (${room.buildingName}, ${room.floorLabel}).`,
        suggestedRoomId: room.id,
        suggestedCourse: course,
      };
    } else {
      const matchedCourse = COURSE_SCHEDULES.find(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q)
      );

      const matchedRoom = ALL_ROOMS.find(
        (r) =>
          q.includes(r.code.toLowerCase()) ||
          q.includes(r.name.toLowerCase()) ||
          (q.includes('baak') && r.code === 'R.213') ||
          (q.includes('mushola') && r.code === 'R.422') ||
          (q.includes('dkv') && r.code === 'R.541') ||
          (q.includes('android') && r.code === 'R.621') ||
          (q.includes('jaringan') && r.code === 'R.534') ||
          (q.includes('perpus') && r.code === 'R.132') ||
          (q.includes('front office') && r.code === 'FRONT OFFICE') ||
          (q.includes('basket') && r.code === 'LAP-BASKET') ||
          (q.includes('pura') && r.code === 'R.241') ||
          (q.includes('aula') && r.code === 'R.231') ||
          (q.includes('gym') && r.code === 'R.551')
      );

      if (matchedCourse) {
        const room = getRoomById(matchedCourse.roomId)!;
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: `MatKul ${matchedCourse.name} berlangsung hari ${matchedCourse.day} (${matchedCourse.startTime}) di ${room.name}, ${room.buildingName} (${room.floorLabel}).`,
          suggestedRoomId: room.id,
          suggestedCourse: matchedCourse,
        };
      } else if (matchedRoom) {
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: `${matchedRoom.name} berada di ${matchedRoom.buildingName}, ${matchedRoom.floorLabel}. ${matchedRoom.desc}`,
          suggestedRoomId: matchedRoom.id,
        };
      } else {
        botReply = {
          id: `b-${Date.now() + 1}`,
          sender: 'bot',
          text: 'Maaf, saya belum menemukan ruangan atau MatKul itu. Coba sebutkan kode ruang (mis. R.541, R.213, R.422) atau buka tab Jadwal & Gedung.',
        };
      }
    }

    setMessages((prev) => [...prev, userMsg, botReply!]);
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
          <h1 className="text-sm font-extrabold text-slate-900">
            Tanya WayFinder (Naturalness)
          </h1>
          <p className="text-[11px] text-slate-500">
            Tanya lokasi gedung G1–G6 atau MatKul dengan bahasa santai
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

      {/* Chat Thread */}
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
                    onStartRouteToRoom(m.suggestedRoomId!, m.suggestedCourse)
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

      {/* Chat Input with Disabled Constraint when empty */}
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
          placeholder="Ketik pertanyaan, mis. Lab Jaringan atau R.541..."
          className="flex-1 px-2.5 py-1.5 text-xs outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={input.trim().length === 0}
          aria-label="Kirim pertanyaan"
          className="w-8 h-8 rounded-xl bg-[#1A2352] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 cursor-pointer transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Digit Rule Hint (Metacognition) */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 space-y-1">
        <p className="text-[11px] font-extrabold text-slate-700 inline-flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#1A2352]" /> Tips Kode Ruang INSTIKI
        </p>
        <p className="text-[10px] text-slate-600 leading-relaxed">
          <strong>Digit 1 = Gedung</strong>, <strong>Digit 2 = Lantai</strong>. Contoh:{' '}
          <code>R.541</code> (Lab DKV) berada di <strong>Gedung 5, Lantai 4</strong>.
        </p>
      </div>
    </div>
  );
};
