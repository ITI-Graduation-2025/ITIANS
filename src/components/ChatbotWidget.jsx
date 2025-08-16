"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaChevronUp, 
  FaChevronDown,
  FaLightbulb,
  FaHistory,
  FaExternalLinkAlt,
  FaTrash,
  FaRegCopy,
  FaBell
} from "react-icons/fa";
import { sendChatbotMessage, getSuggestedPrompts, getChatbotHistory } from "@/services/chatbotService";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
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
    if (isOpen && currentUser?.uid) {
      loadChatHistory();
    }
  }, [isOpen, currentUser]);

  // Update unread count when messages change
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setUnreadCount(messages.length);
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const loadChatHistory = async () => {
    try {
      if (!currentUser?.uid) return;
      
      const history = await getChatbotHistory(currentUser.uid, 10);
      if (history.length > 0) {
        setMessages(history.map(item => ({
          id: item.id,
          type: 'user',
          content: item.prompt,
          timestamp: item.timestamp
        })).concat(history.map(item => ({
          id: `${item.id}-response`,
          type: 'bot',
          content: item.response,
          timestamp: item.timestamp
        }))));
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
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

  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
    setUnreadCount(0);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary/90 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRobot size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}

        {/* Pulse animation for new messages */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute inset-0 bg-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity: 0.3 }}
          />
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-20 right-6 z-40 w-96 h-[500px] bg-card rounded-3xl shadow-2xl border border-border flex flex-col backdrop-blur-sm"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ITIANS Career Assistant</h3>
                  <p className="text-xs opacity-90">Professional Guidance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/chatbot"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Open Full Chatbot Page"
                >
                  <FaExternalLinkAlt size={16} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.length === 0 && showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FaRobot size={32} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Hello! I'm your ITIANS Career Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    I'm here to help you maximize your professional potential on ITIANS. From profile optimization to career strategies, I provide expert guidance tailored for ITI graduates.
                  </p>
                  
                  {/* Suggested Prompts */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <FaLightbulb size={14} className="text-primary" />
                      <span>Try asking me:</span>
                    </div>
                    {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(prompt)}
                        className="block w-full text-left p-3 bg-card hover:bg-accent/50 rounded-xl text-sm text-foreground transition-all duration-200 border border-border hover:border-primary/30"
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
                  <div className="relative group">
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : message.isError
                          ? 'bg-destructive/10 text-destructive border border-destructive/20'
                          : 'bg-card text-foreground border border-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'opacity-70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp?.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {/* Copy button for bot messages */}
                    {message.type === 'bot' && !message.isError && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-accent"
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
                  <div className="bg-card border border-border p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
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
            <div className="p-4 border-t border-border bg-card rounded-b-3xl">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full p-3 pr-12 border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={clearChat}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <FaTrash size={12} />
                  Clear chat
                </button>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {showSuggestions ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                  Suggestions
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
