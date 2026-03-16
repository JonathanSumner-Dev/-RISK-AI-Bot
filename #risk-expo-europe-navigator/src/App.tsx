import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  Globe, 
  BarChart3, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  MapPin,
  Mail,
  Download
} from 'lucide-react';
import { Message, Sector } from './types';
import { chatWithGemini } from './services/gemini';

const INITIAL_GREETING = "Welcome to the #RISK Expo Europe Navigator. I am here to help you maximize your strategic ROI. To get started, tell me which segment you operate in (e.g., GRC Platform, Cybersecurity, ESG Data, or Audit Services).";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-10T09:00:00').getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-lg font-black text-risk-yellow leading-none">{unit.value}</span>
          <span className="text-[8px] text-white/40 uppercase font-bold tracking-tighter mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

const DiscoveryHub = ({ onAction }: { onAction: (prompt: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'role' | 'interest' | 'industry'>('role');
  
  const roles = [
    { id: 'ciso', label: 'CISO / InfoSec', icon: <ShieldCheck size={14} />, stage: 'Information Security Stage' },
    { id: 'dpo', label: 'DPO / Privacy', icon: <Globe size={14} />, stage: 'GRC Stage' },
    { id: 'cro', label: 'CRO / Risk Manager', icon: <BarChart3 size={14} />, stage: 'BFSI Stage' },
    { id: 'esg', label: 'ESG / Sustainability', icon: <Sparkles size={14} />, stage: 'GRC Stage' },
  ];

  const interests = [
    { id: 'ai', label: 'AI & Tech', icon: <Bot size={14} /> },
    { id: 'tprm', label: 'TPRM / Supply Chain', icon: <LayoutDashboard size={14} /> },
    { id: 'reg', label: 'Regulatory Change', icon: <Info size={14} /> },
    { id: 'fincrime', label: 'Financial Crime', icon: <ShieldCheck size={14} /> },
  ];

  const industries = [
    { id: 'bfsi', label: 'BFSI', icon: <BarChart3 size={14} /> },
    { id: 'tech', label: 'Technology', icon: <Globe size={14} /> },
    { id: 'gov', label: 'Government', icon: <Info size={14} /> },
    { id: 'retail', label: 'Retail', icon: <LayoutDashboard size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
        {(['role', 'interest', 'industry'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === tab ? 'bg-risk-teal text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {activeTab === 'role' && roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onAction(`I am a ${role.label}. What are my recommended stages and sessions?`)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-risk-teal group-hover:scale-110 transition-transform">{role.icon}</span>
              <span className="text-xs font-bold text-white/80">{role.label}</span>
            </div>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        ))}
        
        {activeTab === 'interest' && interests.map((interest) => (
          <button
            key={interest.id}
            onClick={() => onAction(`I'm interested in ${interest.label}. Which exhibitors and stages should I visit?`)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-risk-orange group-hover:scale-110 transition-transform">{interest.icon}</span>
              <span className="text-xs font-bold text-white/80">{interest.label}</span>
            </div>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        ))}

        {activeTab === 'industry' && industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onAction(`My industry is ${industry.label}. Show me relevant companies and networking opportunities.`)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-risk-yellow group-hover:scale-110 transition-transform">{industry.icon}</span>
              <span className="text-xs font-bold text-white/80">{industry.label}</span>
            </div>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: INITIAL_GREETING,
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.concat(userMessage).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const responseText = await chatWithGemini(history);

    const modelMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  return (
    <div className="flex h-[100dvh] bg-[#f1f5f9] text-risk-navy font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-85 bg-risk-navy flex flex-col hidden lg:flex relative overflow-y-auto shadow-2xl scrollbar-hide">
        {/* Brand Wave Graphic */}
        <div className="absolute top-0 right-0 w-full h-32 opacity-20 pointer-events-none">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,100 C150,200 350,0 500,100 L500,0 L0,0 Z" fill="#f46036"></path>
          </svg>
        </div>

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-risk-yellow rounded-xl flex items-center justify-center text-risk-navy shadow-lg shadow-risk-yellow/20 rotate-3">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl tracking-tight text-white leading-none">#RISK</h1>
              <p className="text-[10px] text-risk-yellow font-bold uppercase tracking-[0.2em] mt-1">AI Strategist</p>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Event Hub</h2>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <Calendar size={16} className="text-risk-orange" />
                    <span className="text-sm font-bold">10-11 Nov 2026</span>
                  </div>
                  <p className="text-xs text-white/60 ml-7">ExCeL London</p>
                  <div className="mt-4">
                    <CountdownTimer />
                  </div>
                </div>
                <a 
                  href="https://tickets.riskevents.co.uk/events/grcworldforums/1979908/r/risk-ai-bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full p-4 rounded-2xl bg-risk-orange text-white font-bold text-sm hover:bg-risk-red transition-all shadow-xl shadow-risk-orange/20"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} />
                    Register for Free
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Discovery Hub</h2>
              <DiscoveryHub onAction={handleQuickAction} />
            </section>

            <section>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "#RISK Awards Info", icon: <Sparkles size={16} />, prompt: "Tell me about the #RISK Awards." },
                  { label: "ROI Maximization", icon: <BarChart3 size={16} />, prompt: "How can I maximize my ROI at #RISK Expo Europe?" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(item.prompt)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left text-white/70 hover:text-white border border-white/10 group"
                  >
                    <span className="text-risk-teal group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
                <a 
                  href="https://www.riskexpoeurope.com/#3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left text-white/70 hover:text-white border border-white/10 group"
                >
                  <span className="text-risk-orange group-hover:scale-110 transition-transform"><Download size={16} /></span>
                  <span className="text-sm font-medium">Exhibitor Deck</span>
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Contact Team</h2>
              <div className="grid grid-cols-1 gap-2">
                <a 
                  href="mailto:nick@grcworldforums.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <Mail size={16} className="text-risk-yellow group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Contact Sales</span>
                    <span className="text-[10px] text-white/40">nick@grcworldforums.com</span>
                  </div>
                </a>
                <a 
                  href="mailto:jonathan@grcworldforums.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <Mail size={16} className="text-risk-teal group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Marketing & Speaking</span>
                    <span className="text-[10px] text-white/40">jonathan@grcworldforums.com</span>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-auto p-8 relative z-10">
          <div className="p-5 rounded-2xl bg-risk-teal/10 border border-risk-teal/20 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-risk-teal rounded-full flex items-center justify-center">
                <Info size={12} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-risk-teal uppercase tracking-wider">Strategic Insight</span>
            </div>
            <p className="text-xs leading-relaxed text-white/80 italic">
              "Success on a busy floor depends on proactive pre-event targeting. Use me to refine your outreach."
            </p>
          </div>
        </div>

        {/* Decorative Star Elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-risk-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-risk-orange/5 rounded-full blur-3xl"></div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white shadow-inner">
        {/* Header (Mobile) */}
        <header className="lg:hidden p-4 border-b border-slate-200 bg-white flex flex-col gap-3 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-risk-navy rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={16} />
              </div>
              <h1 className="font-heading font-bold text-base text-risk-navy">#RISK Navigator</h1>
            </div>
            <a 
              href="https://tickets.riskevents.co.uk/events/grcworldforums/1979908/r/risk-ai-bot"
              className="text-[9px] font-bold bg-risk-orange text-white px-3 py-1.5 rounded-full uppercase tracking-wider"
            >
              Register
            </a>
          </div>
          <div className="flex flex-col items-center gap-1 py-2 bg-risk-navy rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-risk-yellow/5 pointer-events-none"></div>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest relative z-10">Event Starts In:</span>
            <div className="w-full px-4 relative z-10 scale-90 origin-center">
              <CountdownTimer />
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Banner */}
            <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-risk-navy to-risk-teal text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-3xl font-heading font-bold mb-3">Welcome to the #RISK Expo Europe Navigator</h2>
                <p className="text-white/80 max-w-2xl leading-relaxed">
                  I am your official AI strategist for the event at ExCeL London. 
                  Let's maximize your strategic ROI and navigate the complex GRC landscape together.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider border border-white/10">100+ Exhibitors</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider border border-white/10">Pan-European Focus</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider border border-white/10">Cross-Functional</span>
                </div>
              </div>
              {/* Abstract Shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-risk-yellow/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-risk-orange/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            </div>

            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-6 mb-8 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                    message.role === 'model' ? 'bg-risk-navy text-white' : 'bg-risk-yellow text-risk-navy'
                  }`}>
                    {message.role === 'model' ? <Bot size={22} /> : <User size={22} />}
                  </div>
                  <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-6 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
                      message.role === 'model' 
                        ? 'bg-white border border-slate-200 text-slate-800' 
                        : 'bg-risk-navy text-white shadow-risk-navy/20'
                    }`}>
                      <div className="whitespace-pre-wrap space-y-3">
                        {message.text.split('\n').map((line, i) => {
                          if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                            return (
                              <div key={i} className="flex gap-3 ml-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-risk-orange mt-2 flex-shrink-0" />
                                <p className="flex-1">{line.trim().substring(2)}</p>
                              </div>
                            );
                          }
                          if (line.trim().match(/^\d+\./)) {
                            return (
                              <div key={i} className="flex gap-3 ml-2">
                                <span className="font-bold text-risk-teal">{line.trim().match(/^\d+/)?.[0]}.</span>
                                <p className="flex-1">{line.trim().substring(line.indexOf('.') + 1)}</p>
                              </div>
                            );
                          }
                          if (line.startsWith('#')) {
                            const level = line.match(/^#+/)?.[0].length || 1;
                            const text = line.replace(/^#+\s*/, '');
                            const sizes = ['text-xl font-bold text-risk-navy', 'text-lg font-bold text-risk-navy', 'text-base font-bold text-risk-navy'];
                            return <div key={i} className={`${sizes[level-1] || 'text-sm font-bold'} mt-6 mb-2 first:mt-0`}>{text}</div>;
                          }
                          return <p key={i}>{line}</p>;
                        })}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">
                      {message.role === 'model' ? 'Navigator' : 'Strategist'} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-risk-navy text-white flex items-center justify-center animate-pulse">
                  <Bot size={22} />
                </div>
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-risk-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-risk-teal rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-risk-yellow rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-10 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your AI Strategist anything..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-4 md:py-5 pl-6 md:pl-8 pr-16 md:pr-20 focus:outline-none focus:border-risk-navy focus:bg-white transition-all shadow-inner text-slate-900 placeholder:text-slate-400 font-medium text-sm md:text-base"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-risk-navy text-white rounded-full flex items-center justify-center hover:bg-risk-teal hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-risk-navy/20"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 md:mt-6 px-2 md:px-4">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Globe size={10} className="text-slate-300" />
                  <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">ExCeL London</span>
                </div>
              </div>
              <p className="text-[8px] md:text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                © GRC World Forums
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
