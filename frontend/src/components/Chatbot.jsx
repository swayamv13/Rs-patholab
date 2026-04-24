import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hi there! 👋 Welcome to RS Path Lab. How can I help you today?'
};

const SUGGESTED_QUESTIONS = [
  'How do I book a test?',
  'Where are you located?',
  'When will I get my reports?',
  'What tests do you offer?',
];

const Chatbot = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  // Track the last token to detect user switches
  const prevTokenRef = useRef(token);

  const hasSpeechRecognition = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const resetChat = useCallback(() => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsLoading(false);
    setIsSpeaking(false);
    setIsListening(false);
  }, []);

  // ── FIX 1: Reset messages when chat is CLOSED ──────────────────────────────
  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetChat();
  }, [resetChat]);

  // ── FIX 2: Reset when a different user logs in / logs out ──────────────────
  useEffect(() => {
    if (prevTokenRef.current !== token) {
      prevTokenRef.current = token;
      resetChat();
      setIsOpen(false);
    }
  }, [token, resetChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  // ── FIX 3: Cancel any ongoing speech before speaking new response ──────────
  const speak = useCallback((text) => {
    if (!hasSpeechSynthesis || !ttsEnabled) return;
    // Always cancel previous speech first for a clean, clear output
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Small delay to ensure cancel has settled before new utterance
    setTimeout(() => {
      // Strip Markdown characters for clean voice output
      const cleanText = text
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '')   // Remove italics
        .replace(/#/g, '')    // Remove headings
        .replace(/_/g, '');   // Remove italics

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      // Prefer a clear English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang.startsWith('en-') && !v.name.includes('Compact')) ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    }, 120);
  }, [ttsEnabled, hasSpeechSynthesis]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isLoading) return;

    const newUserMessage = { role: 'user', content: userText };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Cancel any ongoing speech when user sends a new message
    if (hasSpeechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const history = updatedMessages.slice(1, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data } = await axios.post(`${backendUrl}/api/ai/chat`, {
        message: userText,
        history
      });

      const reply = data.success
        ? data.reply
        : "I'm sorry, I couldn't connect right now. Please call us at +91 82102 36683.";

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch {
      const fallback = "I'm having trouble connecting. Please call us at +91 82102 36683 for help!";
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      speak(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, backendUrl, speak, hasSpeechSynthesis]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startListening = () => {
    if (!hasSpeechRecognition || isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => sendMessage(event.results[0][0].transcript);
    recognition.start();
  };

  const toggleTts = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setTtsEnabled(prev => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Phone button */}
      <a
        href="tel:918210236683"
        style={{
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
          color: '#fff', padding: '10px', borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(29,78,216,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Call us"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
        </svg>
      </a>

      {/* ── Chat window — COMPACT ───────────────────────────────────────────── */}
      {isOpen && (
        <div style={{
          width: '310px',            /* smaller width */
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.16)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '10px',
          animation: 'chatSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '34px', height: '34px',
                background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
              }}>👨‍⚕️</div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: 0, lineHeight: 1.2 }}>RS Path Lab AI</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
                  <p style={{ color: '#93c5fd', fontSize: '10px', margin: 0 }}>Free · Unlimited</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {/* TTS toggle */}
              {hasSpeechSynthesis && (
                <button onClick={toggleTts} title={ttsEnabled ? 'Mute voice' : 'Enable voice'} style={{
                  background: ttsEnabled ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)',
                  border: 'none', borderRadius: '7px', padding: '5px',
                  cursor: 'pointer', color: ttsEnabled ? '#4ade80' : '#93c5fd',
                  fontSize: '14px', display: 'flex', alignItems: 'center',
                }}>
                  {isSpeaking ? '🔊' : ttsEnabled ? '🔈' : '🔇'}
                </button>
              )}
              {/* Close — resets chat */}
              <button onClick={handleClose} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '7px',
                padding: '5px', cursor: 'pointer', color: '#fff', fontSize: '13px',
                display: 'flex', alignItems: 'center', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >✕</button>
            </div>
          </div>

          {/* Speaking indicator banner */}
          {isSpeaking && (
            <div style={{
              background: 'linear-gradient(90deg, #1d4ed8, #7c3aed)',
              padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ color: '#fff', fontSize: '10px', fontWeight: 600 }}>🔊 Speaking…</span>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                {[0, 1, 2, 3].map(i => (
                  <span key={i} style={{
                    width: '2px', borderRadius: '2px', background: '#fff',
                    display: 'inline-block',
                    height: `${8 + i * 3}px`,
                    animation: `wavebar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}></span>
                ))}
              </div>
              <button onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }} style={{
                marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: '4px', color: '#fff', fontSize: '10px', padding: '1px 6px', cursor: 'pointer',
              }}>Stop</button>
            </div>
          )}

          {/* Messages — compact height */}
          <div style={{
            height: '260px',           /* fixed compact height */
            overflowY: 'auto', padding: '12px',
            background: '#f8fafc',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '7px',
                    background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', marginRight: '6px', flexShrink: 0, alignSelf: 'flex-end',
                  }}>👨‍⚕️</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                    : '#fff',
                  color: m.role === 'user' ? '#fff' : '#1e293b',
                  borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                  padding: '8px 11px',
                  fontSize: '12.5px',
                  lineHeight: '1.45',
                  boxShadow: m.role === 'user' ? '0 3px 10px rgba(29,78,216,0.3)' : '0 1px 4px rgba(0,0,0,0.07)',
                  border: m.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '7px',
                  background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                }}>👨‍⚕️</div>
                <div style={{
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: '14px 14px 14px 3px', padding: '8px 12px',
                  display: 'flex', gap: '3px', alignItems: 'center',
                }}>
                  {[0, 200, 400].map((delay, i) => (
                    <span key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%', background: '#94a3b8',
                      display: 'inline-block', animation: `bounce 1s infinite ${delay}ms`,
                    }}></span>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions — only on first load */}
          {messages.length <= 1 && !isLoading && (
            <div style={{ padding: '6px 12px 4px', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>Quick Questions</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                    borderRadius: '20px', padding: '3px 10px', fontSize: '11px',
                    cursor: 'pointer', fontWeight: 500,
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input row */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid #f1f5f9', background: '#fff',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {hasSpeechRecognition && (
              <button
                onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : startListening}
                disabled={isLoading}
                title={isListening ? 'Stop listening' : 'Speak'}
                style={{
                  background: isListening ? '#fee2e2' : '#f1f5f9', border: 'none',
                  borderRadius: '8px', padding: '7px', cursor: 'pointer',
                  color: isListening ? '#ef4444' : '#64748b', fontSize: '14px',
                  display: 'flex', flexShrink: 0,
                  animation: isListening ? 'pulse 1s infinite' : 'none',
                }}
              >🎤</button>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening…' : 'Ask anything…'}
              disabled={isLoading || isListening}
              style={{
                flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '10px',
                padding: '7px 11px', fontSize: '12.5px', outline: 'none',
                background: '#f8fafc', color: '#1e293b',
              }}
              onFocus={e => e.target.style.borderColor = '#1d4ed8'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              style={{
                background: (!input.trim() || isLoading) ? '#e2e8f0' : 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                border: 'none', borderRadius: '8px', padding: '7px 10px',
                cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                color: (!input.trim() || isLoading) ? '#94a3b8' : '#fff',
                display: 'flex', flexShrink: 0,
                boxShadow: (!input.trim() || isLoading) ? 'none' : '0 3px 10px rgba(29,78,216,0.35)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 3D Animated Doctor Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="doctor-toggle-btn"
          title="Chat with Doctor AI"
        >
          <div className="doctor-head">
            <div className="doctor-hair"></div>
            <div className="doctor-face">
              <div className="doctor-eye left"></div>
              <div className="doctor-eye right"></div>
              <div className="doctor-mouth"></div>
            </div>
          </div>
          <div className="doctor-body">
             <div className="stethoscope-neck"></div>
          </div>
        </button>
      )}

      <style>{`
        /* Existing animations */
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50%       { box-shadow: 0 0 0 7px rgba(239,68,68,0); }
        }
        @keyframes floatPulse {
          0%, 100% { box-shadow: 0 8px 28px rgba(29,78,216,0.5); transform: translateY(0); }
          50%       { box-shadow: 0 12px 36px rgba(29,78,216,0.7); transform: translateY(-6px); }
        }
        @keyframes wavebar {
          from { opacity: 0.5; }
          to   { opacity: 1; }
        }
        
        /* 3D Doctor Animations */
        .doctor-toggle-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          width: 60px;
          height: 80px;
          perspective: 200px;
          animation: floatPulse 3s ease-in-out infinite;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 0;
          outline: none;
        }
        .doctor-toggle-btn:hover {
          transform: scale(1.1) translateY(-5px);
        }
        
        .doctor-head {
          width: 36px;
          height: 38px;
          background: #fcd5ce; /* Skin color */
          border-radius: 40% 40% 45% 45%;
          position: relative;
          box-shadow: 
            inset -3px -3px 6px rgba(0,0,0,0.1),
            0 4px 6px rgba(0,0,0,0.2);
          z-index: 2;
          transform-style: preserve-3d;
          transition: transform 0.4s;
        }
        .doctor-toggle-btn:hover .doctor-head {
          transform: rotateY(15deg) rotateX(5deg);
        }
        .doctor-hair {
          width: 110%;
          height: 14px;
          background: #472d30;
          position: absolute;
          top: -2px;
          left: -5%;
          border-radius: 50% 50% 10% 10%;
        }
        .doctor-face {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .doctor-eye {
          width: 5px;
          height: 5px;
          background: #1e293b;
          border-radius: 50%;
          position: absolute;
          top: 14px;
          animation: eyeBlink 4s infinite;
        }
        .doctor-eye.left { left: 8px; }
        .doctor-eye.right { right: 8px; }
        
        .doctor-mouth {
          width: 10px;
          height: 4px;
          background: #e07a5f;
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 10px 10px;
          transition: height 0.2s;
        }
        .doctor-toggle-btn:hover .doctor-mouth {
          height: 6px;
          border-radius: 50% 50% 10px 10px;
        }
        
        .doctor-body {
          width: 46px;
          height: 30px;
          background: #ffffff; /* White coat */
          border-radius: 12px 12px 6px 6px;
          position: relative;
          margin-top: -6px;
          z-index: 1;
          box-shadow: 
            inset -2px -2px 5px rgba(0,0,0,0.05),
            0 8px 16px rgba(29,78,216,0.3);
          display: flex;
          justify-content: center;
        }
        
        /* Stethoscope */
        .stethoscope-neck {
          width: 24px;
          height: 18px;
          border: 2px solid #334155;
          border-top: none;
          border-radius: 0 0 12px 12px;
          position: absolute;
          top: 2px;
        }
        .stethoscope-neck::after {
          content: '';
          position: absolute;
          bottom: -2px;
          right: -4px;
          width: 6px;
          height: 6px;
          background: #e2e8f0;
          border: 2px solid #334155;
          border-radius: 50%;
        }

        @keyframes eyeBlink {
          0%, 96%, 98%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.1); }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
