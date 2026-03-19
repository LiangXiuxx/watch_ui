/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Info, 
  Clock, 
  Calendar as CalendarIcon, 
  Sun, 
  Power, 
  Settings as SettingsIcon, 
  Battery, 
  Timer, 
  AlarmClock, 
  Activity, 
  Home, 
  Mic, 
  Wind,
  Tv,
  Lock,
  Droplets,
  Thermometer,
  Fan,
  ChevronLeft,
  Heart,
  Plus,
  Trash2,
  Check,
  X,
  RotateCcw,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Screen = 'boot' | 'watchface' | 'launcher' | 'settings' | 'heartrate' | 'battery' | 'stopwatch' | 'alarm' | 'sports' | 'calendar' | 'smarthome' | 'ai-assistant' | 'sos' | 'settings-power';

interface AppIconProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

// --- Colors (More Saturated but Sophisticated) ---
const VIBRANT_MORANDI = {
  gray: '#8E8E93',
  blue: '#5E5CE6',
  green: '#32D74B',
  red: '#FF453A',
  orange: '#FF9F0A',
  purple: '#BF5AF2',
  cyan: '#64D2FF',
  pink: '#FF375F',
  dark: '#1A1A1A',
  light: '#F2F2F7',
};

// --- Components ---

const SafeZone: React.FC<{ children: React.ReactNode, className?: string, center?: boolean }> = ({ children, className = "", center = true }) => (
  <div className={`w-full flex flex-col items-center ${center ? 'h-full justify-center px-16 py-16' : 'px-14 py-14'} ${className}`}>
    {children}
  </div>
);

const GlowButton: React.FC<{ 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  style?: React.CSSProperties,
  whileHover?: any,
  whileTap?: any,
  glowColor?: string,
  vignette?: boolean
}> = ({ 
  children, 
  onClick, 
  className = "", 
  style = {}, 
  whileHover = { scale: 1.05 }, 
  whileTap = { scale: 1.1, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }, 
  glowColor = "rgba(255,255,255,0.2)",
  vignette = true
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.button
      ref={buttonRef}
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden group transition-all duration-300 ${className}`}
      style={{
        ...style,
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Sliding Glow Layer */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
      />

      {/* Vignette Effect */}
      {vignette && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      )}

      {/* Interactive Glow Layer */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(80px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 80%)`,
        }}
      />
      
      {children}
    </motion.button>
  );
};

const CalendarIconWithDate: React.FC<{ date: Date }> = ({ date }) => (
  <div className="relative flex items-center justify-center">
    <CalendarIcon size={48} strokeWidth={2.5} />
    <span className="absolute top-[18px] text-[14px] font-bold text-current">{date.getDate()}</span>
  </div>
);

const SmartHomeIcon: React.FC = () => (
  <div className="relative flex items-center justify-center">
    <Home size={48} strokeWidth={2.5} />
    <div className="absolute -top-1 -right-1 bg-current rounded-full p-1 border-2 border-[#1A1A1A]">
      <Wifi size={14} strokeWidth={3} className="text-[#1A1A1A]" />
    </div>
  </div>
);

const TimePicker: React.FC<{ 
  range: number[], 
  value: number, 
  onChange: (val: number) => void,
  label: string 
}> = ({ range, value, onChange, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const itemHeight = 60; // Approximate height of each number
    const index = Math.round(scrollTop / itemHeight);
    if (range[index] !== undefined && range[index] !== value) {
      onChange(range[index]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">{label}</div>
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[180px] w-20 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-fade-y"
      >
        <div className="h-[60px]" /> {/* Spacer */}
        {range.map((num) => (
          <div 
            key={num} 
            className={`h-[60px] flex items-center justify-center snap-center transition-all duration-300 ${
              value === num ? 'text-4xl font-bold text-white' : 'text-xl font-medium text-white/10'
            }`}
          >
            {num.toString().padStart(2, '0')}
          </div>
        ))}
        <div className="h-[60px]" /> {/* Spacer */}
      </div>
    </div>
  );
};

const CalendarView: React.FC = () => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const prevYear = () => setViewDate(new Date(year - 1, month, 1));
  const nextYear = () => setViewDate(new Date(year + 1, month, 1));

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col space-y-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={prevYear} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronLeft size={16} className="text-white/40" />
            </button>
            <span className="text-lg font-bold text-[#E0E0E0] min-w-[50px] text-center">{year}</span>
            <button onClick={nextYear} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronRight size={16} className="text-white/40" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={prevMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronLeft size={16} className="text-white/40" />
            </button>
            <span className="text-lg font-bold text-[#E0E0E0] min-w-[40px] text-center">{month + 1}月</span>
            <button onClick={nextMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ChevronRight size={16} className="text-white/40" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 px-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[10px] text-white/20 font-bold py-2 uppercase tracking-widest">{d}</div>
        ))}
        {days.map((day, i) => {
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <div 
              key={i} 
              className={`h-11 flex items-center justify-center rounded-2xl text-base font-medium transition-all ${
                day 
                  ? (isToday 
                      ? 'bg-purple-500/30 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(191,90,242,0.2)]' 
                      : 'text-white/60 hover:bg-white/5') 
                  : ''
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AppIcon: React.FC<AppIconProps> = ({ icon, label, color, onClick }) => {
  const isHeart = label === '心率';
  
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <GlowButton
        onClick={onClick}
        className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl border border-white/10"
        style={{ 
          background: `linear-gradient(135deg, ${color}40, ${color}10)`,
          color: color 
        }}
      >
        <motion.div 
          animate={isHeart ? { scale: [1, 1.15, 1] } : {}}
          transition={isHeart ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
          className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        >
          {React.cloneElement(icon as React.ReactElement, { size: 48, strokeWidth: 2.5, color: 'currentColor' })}
        </motion.div>
      </GlowButton>
      <span className="text-[22px] text-[#E0E0E0] font-semibold tracking-tight">{label}</span>
    </div>
  );
};

const SettingItem: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, value?: string }> = ({ icon, label, onClick, value }) => (
  <GlowButton
    onClick={onClick}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 mb-3 text-left border border-white/5"
  >
    <div className="flex items-center space-y-0 space-x-4">
      <div className="text-white/70">{React.cloneElement(icon as React.ReactElement, { strokeWidth: 2 })}</div>
      <span className="text-[18px] text-[#E0E0E0] font-medium">{label}</span>
    </div>
    {value && <span className="text-sm text-white/40">{value}</span>}
  </GlowButton>
);

const Waveform: React.FC = () => (
  <div className="flex items-end justify-center space-x-1 h-8">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <motion.div
        key={i}
        animate={{ height: [4, 16, 4, 12, 4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        className="w-1 bg-red-400/50 rounded-full"
      />
    ))}
  </div>
);

const BatteryBar: React.FC<{ level: number, large?: boolean }> = ({ level, large = false }) => (
  <div className={`flex flex-col items-center ${large ? 'space-y-3' : 'space-y-2'}`}>
    <div className={`${large ? 'w-24 h-3' : 'w-12 h-2'} bg-white/10 rounded-full overflow-hidden`}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${level}%` }}
        className="h-full bg-green-400/60"
      />
    </div>
    <span className={`${large ? 'text-lg' : 'text-[10px]'} text-white/60 font-medium`}>{level}%</span>
  </div>
);

const SportItem: React.FC<{ icon: React.ReactNode, label: string, color: string, compact?: boolean }> = ({ icon, label, color, compact = false }) => (
  <GlowButton className={`flex items-center w-full rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10 ${compact ? 'flex-col p-3 justify-center' : 'p-4'}`}>
    <div className={`${color} ${compact ? 'mb-2' : 'mr-4'}`}>
      {React.cloneElement(icon as React.ReactElement, { size: compact ? 18 : 20, strokeWidth: 2 })}
    </div>
    <span className={`text-[#E0E0E0] font-medium ${compact ? 'text-xs' : 'text-base'}`}>{label}</span>
  </GlowButton>
);

const ScreenHeader: React.FC<{ title: string, onBack: () => void }> = ({ title, onBack }) => (
  <div className="flex items-center w-full mb-4 pt-2 -ml-2">
    <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white/80 transition-colors">
      <ChevronLeft size={24} strokeWidth={2.5} />
    </button>
    <h2 className="text-xl font-bold text-[#E0E0E0] tracking-tight">{title}</h2>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('boot');
  const [time, setTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(72);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [launcherPage, setLauncherPage] = useState(0);
  const launcherRef = useRef<HTMLDivElement>(null);

  // Alarm State
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:30', label: '工作日', active: true },
    { id: 2, time: '09:00', label: '周末', active: false },
    { id: 3, time: '22:00', label: '睡觉', active: true }
  ]);
  const [editingAlarm, setEditingAlarm] = useState<number | null>(null);
  const [tempTime, setTempTime] = useState({ hour: 7, minute: 30 });

  const handleEditAlarm = (id: number) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      const [h, m] = alarm.time.split(':').map(Number);
      setTempTime({ hour: h, minute: m });
      setEditingAlarm(id);
    }
  };

  const handleAddAlarm = () => {
    const newId = Math.max(0, ...alarms.map(a => a.id)) + 1;
    setAlarms(prev => [...prev, { id: newId, time: '08:00', label: '新闹钟', active: true }]);
    setTempTime({ hour: 8, minute: 0 });
    setEditingAlarm(newId);
  };

  const saveAlarm = () => {
    const timeStr = `${tempTime.hour.toString().padStart(2, '0')}:${tempTime.minute.toString().padStart(2, '0')}`;
    setAlarms(prev => prev.map(a => a.id === editingAlarm ? { ...a, time: timeStr } : a));
    setEditingAlarm(null);
  };

  // Smart Home State
  const [devices, setDevices] = useState([
    { id: 1, name: '地暖', active: true, icon: <Sun size={20} /> },
    { id: 2, name: '窗帘', active: false, icon: <Activity size={20} /> },
    { id: 3, name: '客厅灯', active: true, icon: <Power size={20} /> },
    { id: 4, name: '空调', active: true, icon: <Wind size={20} /> },
    { id: 5, name: '厨房灯', active: false, icon: <Power size={20} /> },
    { id: 6, name: '卧室灯', active: false, icon: <Power size={20} /> },
    { id: 7, name: '电视', active: false, icon: <Tv size={20} /> },
    { id: 8, name: '净化器', active: true, icon: <Wind size={20} /> },
    { id: 9, name: '扫地机', active: false, icon: <Activity size={20} /> },
    { id: 10, name: '智能锁', active: true, icon: <Lock size={20} /> },
    { id: 11, name: '加湿器', active: false, icon: <Droplets size={20} /> },
    { id: 12, name: '热水器', active: true, icon: <Thermometer size={20} /> },
    { id: 13, name: '风扇', active: false, icon: <Fan size={20} /> },
  ]);

  // Schedule State
  const [events] = useState([
    { id: 1, time: '09:00', title: '晨会', location: '会议室 A' },
    { id: 2, time: '12:00', title: '午餐', location: '员工餐厅' },
    { id: 3, time: '14:30', title: '项目评审', location: '线上会议' },
    { id: 4, time: '18:00', title: '健身', location: '健身房' },
  ]);

  const handleLauncherScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.offsetHeight;
    const page = Math.round(scrollTop / height);
    setLauncherPage(page);
  };

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated Heart Rate
  useEffect(() => {
    if (currentScreen === 'heartrate') {
      const hrInterval = setInterval(() => {
        setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 2000);
      return () => clearInterval(hrInterval);
    }
  }, [currentScreen]);

  // Boot sequence
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setCurrentScreen('watchface');
    }, 4000); // Slightly longer for the new animation
    return () => clearTimeout(bootTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    const screenBg = "bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]";

    switch (currentScreen) {
      case 'boot':
        return (
          <div className={`flex flex-col items-center justify-center h-full ${screenBg} relative overflow-hidden`}>
            {/* Animated Background Elements */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent_70%)]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center z-10"
            >
              {/* iSoftStone Style Logo */}
              <div className="flex items-center mb-6">
                <div className="relative mr-3">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="w-10 h-14 bg-[#E60012] rounded-tl-full rounded-br-full"
                  />
                </div>
                <div className="flex flex-col">
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-white font-bold text-5xl tracking-tight"
                  >
                    iSoftStone
                  </motion.span>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center space-x-6 w-full"
              >
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-white/60 font-bold tracking-[0.6em] text-sm uppercase">软通动力</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/30" />
              </motion.div>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="absolute bottom-24 h-[2px] bg-white/20 rounded-full overflow-hidden"
            >
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-white/60"
              />
            </motion.div>
          </div>
        );

      case 'watchface':
        return (
          <GlowButton 
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 1 }}
            onClick={() => navigateTo('launcher')}
            className={`relative h-full w-full flex flex-col items-center justify-center ${screenBg} overflow-hidden`}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
            
            <SafeZone>
              {/* Complications */}
              <div className="absolute top-20 flex space-x-12 text-white/60 text-[16px] font-bold">
                <div className="flex flex-col items-center space-y-2">
                  <Activity size={24} strokeWidth={3} className="text-orange-400" />
                  <span>1,240</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Heart size={24} strokeWidth={3} className="text-red-400" />
                  <span>{heartRate}</span>
                </div>
              </div>

              {/* Time */}
              <div className="text-center z-10">
                <motion.div 
                  layoutId="time"
                  className="text-8xl font-light text-[#E0E0E0] tracking-tighter"
                >
                  {formatTime(time)}
                </motion.div>
                <div className="text-sm text-white/30 font-medium uppercase tracking-[0.2em] mt-2">
                  {formatDate(time)}
                </div>
              </div>

              {/* Bottom Complication */}
              <div className="absolute bottom-20 w-full flex justify-center">
                <BatteryBar level={batteryLevel} large={true} />
              </div>
            </SafeZone>

            {/* Interaction Hint */}
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-6 w-12 h-1 bg-white/10 rounded-full"
            />
          </GlowButton>
        );

      case 'launcher':
        return (
          <div 
            ref={launcherRef}
            onScroll={handleLauncherScroll}
            className={`h-full w-full ${screenBg} overflow-y-auto snap-y snap-mandatory no-scrollbar flex flex-col`}
          >
            {/* Page 1 */}
            <div className="w-full h-full flex-shrink-0 snap-center">
              <SafeZone center={true} className="px-18 py-18">
                <div className="grid grid-cols-2 grid-rows-2 gap-y-6 gap-x-8">
                  <AppIcon icon={<Heart />} label="心率" color={VIBRANT_MORANDI.red} onClick={() => navigateTo('heartrate')} />
                  <AppIcon icon={<Battery />} label="电池" color={VIBRANT_MORANDI.green} onClick={() => navigateTo('battery')} />
                  <AppIcon icon={<Timer />} label="秒表" color={VIBRANT_MORANDI.blue} onClick={() => navigateTo('stopwatch')} />
                  <AppIcon icon={<AlarmClock />} label="闹钟" color={VIBRANT_MORANDI.orange} onClick={() => navigateTo('alarm')} />
                </div>
              </SafeZone>
            </div>

            {/* Page 2 */}
            <div className="w-full h-full flex-shrink-0 snap-center">
              <SafeZone center={true} className="px-18 py-18">
                <div className="grid grid-cols-2 grid-rows-2 gap-y-6 gap-x-8">
                  <AppIcon icon={<Activity />} label="运动" color={VIBRANT_MORANDI.orange} onClick={() => navigateTo('sports')} />
                  <AppIcon icon={<Mic />} label="助手" color={VIBRANT_MORANDI.cyan} onClick={() => navigateTo('ai-assistant')} />
                  <AppIcon icon={<CalendarIconWithDate date={time} />} label="日历" color={VIBRANT_MORANDI.purple} onClick={() => navigateTo('calendar')} />
                  <AppIcon icon={<SmartHomeIcon />} label="家居" color={VIBRANT_MORANDI.pink} onClick={() => navigateTo('smarthome')} />
                </div>
              </SafeZone>
            </div>

            {/* Page 3 */}
            <div className="w-full h-full flex-shrink-0 snap-center">
              <SafeZone center={true} className="px-18 py-18">
                <div className="grid grid-cols-2 grid-rows-2 gap-y-6 gap-x-8">
                  <AppIcon icon={<SettingsIcon />} label="设置" color={VIBRANT_MORANDI.gray} onClick={() => navigateTo('settings')} />
                  <AppIcon icon={<div className="text-4xl font-black">SOS</div>} label="急救" color={VIBRANT_MORANDI.red} onClick={() => navigateTo('sos')} />
                  <div className="w-22 h-22" /> {/* Spacer */}
                  <div className="w-22 h-22" /> {/* Spacer */}
                </div>
              </SafeZone>
            </div>

            {/* Page Indicators (Vertical on the right) */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-40">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ 
                    height: launcherPage === i ? 16 : 6,
                    backgroundColor: launcherPage === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
                  }}
                  className="w-1.5 rounded-full transition-all duration-300"
                />
              ))}
            </div>

            {/* Back to watchface */}
            <button 
              onClick={() => navigateTo('watchface')}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/10 rounded-full backdrop-blur-md z-30"
            />
          </div>
        );

      case 'settings':
        return (
          <div className={`h-full w-full ${screenBg} overflow-y-auto no-scrollbar`}>
            <SafeZone center={false} className="pt-12">
              <ScreenHeader title="设置" onBack={() => navigateTo('launcher')} />
              <div className="space-y-1 w-full pb-24">
                <SettingItem icon={<Wifi size={20} />} label="无线局域网" value="Vela_5G" />
                <SettingItem icon={<Bluetooth size={20} />} label="蓝牙" value="已连接" />
                <SettingItem icon={<Sun size={20} />} label="显示与亮度" />
                <SettingItem icon={<Clock size={20} />} label="时间设置" />
                <SettingItem icon={<CalendarIcon size={20} />} label="日期设置" />
                <SettingItem icon={<Info size={20} />} label="关于设备" />
                <SettingItem icon={<Power size={20} className="text-red-400/60" />} label="重启与关机" onClick={() => navigateTo('settings-power')} />
              </div>
            </SafeZone>
          </div>
        );

      case 'settings-power':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="重启与关机" onBack={() => navigateTo('settings')} />
              <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="flex flex-col items-center space-y-4">
                  <GlowButton 
                    onClick={() => navigateTo('boot')}
                    className="w-24 h-24 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400"
                  >
                    <RotateCcw size={64} strokeWidth={2} />
                  </GlowButton>
                  <span className="text-white/60 font-medium">重启设备</span>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <GlowButton 
                    onClick={() => navigateTo('boot')}
                    className="w-24 h-24 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400"
                  >
                    <Power size={64} strokeWidth={2} />
                  </GlowButton>
                  <span className="text-white/60 font-medium">立即关机</span>
                </div>
              </div>
            </SafeZone>
          </div>
        );

      case 'heartrate':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="心率" onBack={() => navigateTo('launcher')} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-red-400 mb-6"
                >
                  <Heart size={64} strokeWidth={2.5} fill="currentColor" className="opacity-60" />
                </motion.div>
                <div className="text-7xl font-light text-[#E0E0E0] mb-2">{heartRate}</div>
                <div className="text-sm text-white/30 uppercase tracking-[0.4em] mb-8">BPM</div>
                <div className="w-full px-8">
                  <Waveform />
                </div>
              </div>
            </SafeZone>
          </div>
        );

      case 'stopwatch':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="秒表" onBack={() => navigateTo('launcher')} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="text-7xl font-mono text-[#E0E0E0] mb-16 tabular-nums tracking-tighter">00:12.45</div>
                <div className="flex space-x-8">
                  <GlowButton className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-lg font-medium">重置</GlowButton>
                  <GlowButton className="w-20 h-20 rounded-full bg-blue-400/20 border border-blue-400/20 flex items-center justify-center text-blue-400/80 text-lg font-bold">开始</GlowButton>
                </div>
              </div>
            </SafeZone>
          </div>
        );

      case 'alarm':
        return (
          <div className={`h-full w-full ${screenBg} overflow-y-auto no-scrollbar`}>
            <SafeZone center={false} className="pt-12">
              <ScreenHeader title="闹钟" onBack={() => navigateTo('launcher')} />
              <div className="space-y-3 w-full pb-24">
                {alarms.map((alarm) => (
                  <motion.div
                    key={alarm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlowButton 
                      onClick={() => handleEditAlarm(alarm.id)}
                      className="w-full p-5 rounded-3xl bg-white/5 flex items-center justify-between border border-white/5"
                    >
                      <div className="text-left">
                        <div className={`text-3xl font-bold ${alarm.active ? 'text-[#E0E0E0]' : 'text-white/20'}`}>{alarm.time}</div>
                        <div className="text-xs text-white/30 mt-1">{alarm.label}</div>
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, active: !a.active } : a));
                        }}
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${alarm.active ? 'bg-orange-400/40' : 'bg-white/10'}`}
                      >
                        <motion.div 
                          animate={{ x: alarm.active ? 20 : 0 }}
                          className="w-5 h-5 bg-white/80 rounded-full" 
                        />
                      </div>
                    </GlowButton>
                  </motion.div>
                ))}
                <GlowButton 
                  onClick={handleAddAlarm}
                  className="w-full p-5 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/20"
                >
                  <Plus size={24} strokeWidth={2} />
                </GlowButton>
              </div>
            </SafeZone>

            {/* Simple Time Edit Modal */}
            <AnimatePresence>
              {editingAlarm !== null && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#121212]/95 backdrop-blur-xl flex items-center justify-center p-6"
                >
                  <div className="flex flex-col items-center w-full max-w-[320px]">
                    {/* Time Picker Section */}
                    <div className="flex items-center justify-center space-x-4 mb-10 w-full">
                      <TimePicker 
                        label="小时"
                        range={Array.from({ length: 24 }, (_, i) => i)} 
                        value={tempTime.hour} 
                        onChange={(h) => setTempTime(prev => ({ ...prev, hour: h }))} 
                      />
                      <div className="text-3xl font-bold text-white/10 pt-6">:</div>
                      <TimePicker 
                        label="分钟"
                        range={Array.from({ length: 60 }, (_, i) => i)} 
                        value={tempTime.minute} 
                        onChange={(m) => setTempTime(prev => ({ ...prev, minute: m }))} 
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <GlowButton 
                          onClick={saveAlarm} 
                          className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400/80 space-x-2"
                        >
                          <Check size={20} strokeWidth={2.5} />
                          <span className="font-bold">完成</span>
                        </GlowButton>
                        <GlowButton 
                          onClick={() => setEditingAlarm(null)} 
                          className="py-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400/80 space-x-2"
                        >
                          <X size={20} strokeWidth={2.5} />
                          <span className="font-bold">取消</span>
                        </GlowButton>
                      </div>
                      
                      <GlowButton 
                        onClick={() => {
                          setAlarms(prev => prev.filter(a => a.id !== editingAlarm));
                          setEditingAlarm(null);
                        }} 
                        className="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400/80 space-x-2"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                        <span className="font-bold">删除闹钟</span>
                      </GlowButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'sports':
        return (
          <div className={`h-full w-full ${screenBg} overflow-y-auto no-scrollbar`}>
            <SafeZone center={false} className="pt-12">
              <ScreenHeader title="运动" onBack={() => navigateTo('launcher')} />
              <div className="flex flex-col space-y-4 w-full pb-24">
                <SportItem icon={<Activity />} label="户外跑步" color="text-orange-400" />
                <SportItem icon={<Activity />} label="室内步行" color="text-blue-400" />
                <SportItem icon={<Activity />} label="户外骑行" color="text-green-400" />
                <SportItem icon={<Activity />} label="自由训练" color="text-purple-400" />
                <SportItem icon={<Activity />} label="游泳" color="text-cyan-400" />
                <SportItem icon={<Activity />} label="登山" color="text-emerald-400" />
              </div>
            </SafeZone>
          </div>
        );

      case 'calendar':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12">
              <ScreenHeader title="日历" onBack={() => navigateTo('launcher')} />
              <div className="w-full">
                <CalendarView />
              </div>
            </SafeZone>
          </div>
        );

      case 'smarthome':
        return (
          <div className={`h-full w-full ${screenBg} overflow-y-auto no-scrollbar`}>
            <SafeZone center={false} className="pt-12">
              <ScreenHeader title="智能家居" onBack={() => navigateTo('launcher')} />
              <div className="grid grid-cols-2 gap-4 w-full pb-24">
                {devices.map((device) => (
                  <GlowButton 
                    key={device.id} 
                    onClick={() => setDevices(prev => prev.map(d => d.id === device.id ? { ...d, active: !d.active } : d))}
                    className={`flex flex-col items-start p-5 rounded-[32px] border transition-all duration-300 ${device.active ? 'bg-blue-400/20 border-blue-400/30' : 'bg-white/5 border-white/5'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${device.active ? 'text-blue-400' : 'text-white/40'}`}>
                      {React.cloneElement(device.icon as React.ReactElement, { size: 24, strokeWidth: 2 })}
                    </div>
                    <div className="text-[18px] font-bold text-[#E0E0E0]">{device.name}</div>
                    <div className={`text-[12px] mt-1 ${device.active ? 'text-blue-400/80' : 'text-white/20'}`}>
                      {device.active ? '已开启' : '已关闭'}
                    </div>
                  </GlowButton>
                ))}
              </div>
            </SafeZone>
          </div>
        );

      case 'battery':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="电池" onBack={() => navigateTo('launcher')} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="84" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <motion.circle 
                      cx="96" cy="96" r="84" fill="none" stroke={VIBRANT_MORANDI.green} strokeWidth="12" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: batteryLevel / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-bold text-[#E0E0E0]">{batteryLevel}%</div>
                    <div className="text-xs text-white/30 mt-2 uppercase tracking-widest">剩余电量</div>
                  </div>
                </div>
                <div className="text-white/40 text-sm tracking-wider">预计可用 24 小时</div>
              </div>
            </SafeZone>
          </div>
        );

      case 'ai-assistant':
        return (
          <div className={`h-full w-full ${screenBg} overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="小智" onBack={() => navigateTo('launcher')} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="text-white/80 text-xl mb-10 font-bold">正在倾听...</div>
                <div className="flex items-center space-x-3 h-20">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [20, 60, 20] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                    />
                  ))}
                </div>
                <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/5 text-white/60 text-sm text-center italic max-w-[240px]">
                  "帮我查一下明天的天气"
                </div>
              </div>
            </SafeZone>
          </div>
        );

      case 'sos':
        return (
          <div className={`h-full w-full bg-red-950/40 overflow-hidden`}>
            <SafeZone center={false} className="pt-12 h-full flex flex-col">
              <ScreenHeader title="紧急呼救" onBack={() => navigateTo('launcher')} />
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                >
                  <div className="text-4xl font-black text-white">SOS</div>
                </motion.div>
                <div className="text-white text-2xl font-bold mb-2">正在拨打 120</div>
                <div className="text-white/40 text-sm mb-10">将在 5 秒后自动呼叫</div>
                <GlowButton onClick={() => navigateTo('launcher')} className="px-12 py-4 rounded-full bg-white/10 text-white text-sm font-bold">取消</GlowButton>
              </div>
            </SafeZone>
          </div>
        );

      default:
        return <div className="text-white">Screen Not Implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-sans">
      {/* Physical Watch Frame - Rectangular 2.06" */}
      <div className="relative w-[480px] h-[580px] bg-neutral-800 rounded-[80px] shadow-[0_0_80px_rgba(0,0,0,0.6)] border-[12px] border-neutral-700 flex items-center justify-center">
        
        {/* Side Button (Crown) - Straightened for rectangular frame */}
        <div 
          className="absolute right-[-10px] top-[180px] w-5 h-20 bg-neutral-600 rounded-r-xl border-y border-r border-neutral-500 shadow-lg cursor-pointer active:scale-95 transition-transform z-20" 
          onClick={() => navigateTo('watchface')} 
        />
        <div 
          className="absolute right-[-10px] top-[280px] w-4 h-14 bg-neutral-600 rounded-r-xl border-y border-r border-neutral-500 shadow-lg cursor-pointer active:scale-95 transition-transform z-20" 
          onClick={() => navigateTo('launcher')} 
        />

        {/* Rectangular Screen Container - 410x502 */}
        <div className="relative w-[410px] h-[502px] rounded-[60px] bg-black overflow-hidden shadow-inner border-4 border-black z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>

          {/* Screen Reflection Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10 z-20" />
        </div>

        {/* Brand Label - Positioned at bottom */}
        <div className="absolute bottom-10 text-neutral-500 font-bold tracking-[0.3em] text-[10px] uppercase z-20">Vela Smart</div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-8 left-8 text-white/30 text-xs max-w-xs space-y-2">
        <p>• 点击屏幕进入应用列表</p>
        <p>• 点击侧边旋钮返回表盘</p>
        <p>• 点击侧边按钮进入应用列表</p>
        <p>• 体验心率、电池、AI助手等交互</p>
      </div>
    </div>
  );
}
