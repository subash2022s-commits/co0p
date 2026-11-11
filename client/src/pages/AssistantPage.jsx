import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Toast } from '../components/common/Toast.jsx';
import {
  BotMessageSquare,
  Send,
  Plus,
  Trash2,
  Sparkles,
  User,
  ShieldAlert,
  Loader2,
  MessageSquare,
} from 'lucide-react';

export const AssistantPage = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);

  const starterQuestions = [
    'How do I test and improve soil organic carbon naturally?',
    'What biofertilizers can replace synthetic nitrogen in paddy?',
    'How can I identify fall armyworm in maize crops early?',
    'What are the best water-saving techniques for drip irrigation?',
    'Suggest intercropping combinations for pulses and cereals.',
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentConversation?.id) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await apiService.listConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !currentConversation) {
          setCurrentConversation(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadMessages = async (convId) => {
    try {
      setLoadingHistory(true);
      const res = await apiService.getConversationMessages(convId);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStartNewChat = async () => {
    try {
      const res = await apiService.createConversation({
        title: 'New Agricultural Query',
        language,
      });
      if (res.success && res.data) {
        setConversations([res.data, ...conversations]);
        setCurrentConversation(res.data);
        setMessages([]);
      }
    } catch (err) {
      setToast({ message: 'Failed to create conversation', type: 'error' });
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    let targetConv = currentConversation;
    if (!targetConv) {
      try {
        const createRes = await apiService.createConversation({
          title: text.slice(0, 30),
          language,
        });
        if (createRes.success) {
          targetConv = createRes.data;
          setConversations([targetConv, ...conversations]);
          setCurrentConversation(targetConv);
        }
      } catch (err) {
        setToast({ message: 'Failed to initialize conversation', type: 'error' });
        return;
      }
    }

    const optimisticUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await apiService.sendMessage(targetConv.id, text, language);
      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticUserMsg.id),
          res.data.userMessage,
          res.data.assistantMessage,
        ]);
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to get response', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm('Delete this conversation history?')) return;
    try {
      await apiService.deleteConversation(convId);
      const remaining = conversations.filter((c) => c.id !== convId);
      setConversations(remaining);
      if (currentConversation?.id === convId) {
        setCurrentConversation(remaining[0] || null);
        setMessages([]);
      }
      setToast({ message: 'Conversation deleted', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to delete conversation', type: 'error' });
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              AgroAI Agricultural Assistant
              <Badge variant="forest">Active</Badge>
            </h1>
            <p className="text-xs text-slate-500">
              Responsible agronomic intelligence • Answers in {language === 'kn' ? 'Kannada' : 'English'}
            </p>
          </div>
        </div>

        <Button size="sm" icon={Plus} onClick={handleStartNewChat}>
          New Chat
        </Button>
      </div>

      {/* Main Container: Sidebar + Chat Box */}
      <div className="flex-1 flex gap-4 pt-4 min-h-0">
        {/* Left: Saved Conversations */}
        <div className="hidden md:flex flex-col w-64 bg-white rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conversations ({conversations.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No chat history</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setCurrentConversation(conv)}
                  className={`p-3 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    currentConversation?.id === conv.id
                      ? 'bg-forest-50 text-forest-900 font-bold border-l-4 border-forest-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate flex-1">{conv.title || 'Agricultural Discussion'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="p-1 text-slate-300 hover:text-red-600 rounded ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Messages & Input */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loadingHistory ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  How can AgroAI assist your farm today?
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-6">
                  Ask about soil preparation, organic manures, irrigation timings, pests, or disease remedies.
                </p>

                <div className="w-full max-w-md space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Suggested Inquiries:
                  </span>
                  {starterQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 hover:border-forest-500 hover:bg-forest-50/50 transition-colors"
                    >
                      🌱 {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id || i}
                    className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BotMessageSquare className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-50 border border-slate-200 text-slate-800'
                          : 'bg-forest-700 text-white shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex gap-3 items-center text-xs text-slate-500 italic p-2">
                <Loader2 className="w-4 h-4 animate-spin text-forest-600" />
                <span>AgroAI is consulting agronomic directives...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  language === 'kn'
                    ? 'ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                    : 'Ask an agricultural question (e.g. fertilizer dose for paddy)...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={sending}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600 bg-white"
              />
              <Button type="submit" loading={sending} icon={Send} size="md">
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

