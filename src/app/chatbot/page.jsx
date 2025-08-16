"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaRobot, 
  FaPaperPlane, 
  FaLightbulb,
  FaRegCopy,
  FaTrash,
  FaPlus,
  FaHistory,
  FaClock,
  FaSearch,
  FaArrowLeft,
  FaEllipsisH,
  FaStar,
  FaRegStar
} from "react-icons/fa";
import { sendChatbotMessage, getSuggestedPrompts, getChatbotHistory } from "@/services/chatbotService";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";

const ChatbotPage = () => {
  const [currentThread, setCurrentThread] = useState(null);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentUser = useCurrentUser();

  const suggestedPrompts = getSuggestedPrompts();

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when component mounts
  useEffect(() => {
    if (currentUser?.uid) {
      loadChatHistory();
    }
  }, [currentUser]);

  const loadChatHistory = async () => {
    try {
      if (!currentUser?.uid) return;
      
      const history = await getChatbotHistory(currentUser.uid, 50);
      if (history.length > 0) {
        // Group conversations by date to create threads
        const groupedHistory = groupHistoryByDate(history);
        setThreads(groupedHistory);
        
        // Set the most recent thread as current
        if (groupedHistory.length > 0) {
          setCurrentThread(groupedHistory[0]);
          setMessages(groupedHistory[0].messages);
          setShowSuggestions(false);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const groupHistoryByDate = (history) => {
    const groups = {};
    
    history.forEach((item, index) => {
      const date = new Date(item.timestamp?.toDate?.() || item.timestamp).toDateString();
      
      if (!groups[date]) {
        groups[date] = {
          id: date,
          title: `Conversation ${new Date(date).toLocaleDateString('en-US')}`,
          date: date,
          messages: [],
          isFavorite: false
        };
      }
      
      // Add user message
      groups[date].messages.push({
        id: `${item.id}-user`,
        type: 'user',
        content: item.prompt,
        timestamp: item.timestamp
      });
      
      // Add bot response
      groups[date].messages.push({
        id: `${item.id}-bot`,
        type: 'bot',
        content: item.response,
        timestamp: item.timestamp
      });
    });
    
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const result = await sendChatbotMessage(inputMessage, currentUser?.uid);
      
      if (result.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: result.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        
        // Update current thread
        if (currentThread) {
          setCurrentThread(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage, botMessage]
          }));
        }
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: "Sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewThread = () => {
    const newThread = {
      id: Date.now().toString(),
      title: "New Conversation",
      date: new Date().toDateString(),
      messages: [],
      isFavorite: false
    };
    
    setThreads(prev => [newThread, ...prev]);
    setCurrentThread(newThread);
    setMessages([]);
    setShowSuggestions(true);
  };

  const selectThread = (thread) => {
    setCurrentThread(thread);
    setMessages(thread.messages);
    setShowSuggestions(thread.messages.length === 0);
  };

  const toggleFavorite = (threadId) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, isFavorite: !thread.isFavorite }
        : thread
    ));
  };

  const deleteThread = (threadId) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    if (currentThread?.id === threadId) {
      if (threads.length > 1) {
        const nextThread = threads.find(thread => thread.id !== threadId);
        selectThread(nextThread);
      } else {
        createNewThread();
      }
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
              >
                <FaArrowLeft size={20} className="text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FaRobot size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">ITIANS Career Assistant</h1>
                  <p className="text-sm text-muted-foreground">Professional Guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Threads */}
          <div className="lg:col-span-1 bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Conversations</h2>
              <button
                onClick={createNewThread}
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
                title="New conversation"
              >
                <FaPlus size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Threads List */}
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredThreads.map((thread) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    currentThread?.id === thread.id
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-background border-border hover:bg-accent/50'
                  }`}
                  onClick={() => selectThread(thread)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {thread.title}
                        </h3>
                        {thread.isFavorite && (
                          <FaStar size={12} className="text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {thread.messages.length} messages
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(thread.date).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(thread.id);
                        }}
                        className="p-1 hover:bg-accent/50 rounded transition-colors"
                      >
                        {thread.isFavorite ? (
                          <FaStar size={12} className="text-yellow-500" />
                        ) : (
                          <FaRegStar size={12} className="text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThread(thread.id);
                        }}
                        className="p-1 hover:bg-destructive/10 rounded transition-colors"
                      >
                        <FaTrash size={12} className="text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-border flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {currentThread?.title || "New Conversation"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentThread?.messages?.length || 0} messages
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
                    title="Suggestions"
                  >
                    <FaLightbulb size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
              {messages.length === 0 && showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <FaRobot size={40} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-3">Hello! I'm your ITIANS Career Assistant</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    I'm here to help you maximize your professional potential on ITIANS. From profile optimization to career strategies, I provide expert guidance tailored for ITI graduates.
                  </p>
                  
                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedPrompts.slice(0, 6).map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(prompt)}
                        className="p-4 bg-card hover:bg-accent/50 rounded-xl text-sm text-foreground transition-all duration-200 border border-border hover:border-primary/30"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="relative group max-w-[70%]">
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : message.isError
                          ? 'bg-destructive/10 text-destructive border border-destructive/20'
                          : 'bg-card text-foreground border border-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <div className={`flex items-center gap-2 mt-2 ${
                        message.type === 'user' ? 'opacity-70' : 'text-muted-foreground'
                      }`}>
                        <FaClock size={10} />
                        <span className="text-xs">
                          {message.timestamp?.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Copy button for bot messages */}
                    {message.type === 'bot' && !message.isError && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
                        title="Copy message"
                      >
                        <FaRegCopy size={12} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-card rounded-b-2xl">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full p-4 pr-12 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                    rows="1"
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primary text-white p-4 rounded-full hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
