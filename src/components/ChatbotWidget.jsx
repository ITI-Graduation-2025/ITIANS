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

// Markdown renderer component
const MarkdownRenderer = ({ content }) => {
  const renderContent = (text) => {
    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="code-block">
        ${lang ? `<div class="code-lang">${lang}</div>` : ''}
        <pre><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Bullet points
    text = text.replace(/^- (.+)$/gm, '<li class="bullet-item">$1</li>');
    text = text.replace(/(<li class="bullet-item">.*<\/li>\s*)+/gs, (match) => {
      return `<ul class="bullet-list">${match}</ul>`;
    });

    // Numbers list
    text = text.replace(/^(\d+)\. (.+)$/gm, '<li class="number-item">$2</li>');
    text = text.replace(/(<li class="number-item">.*<\/li>\s*)+/gs, (match) => {
      return `<ol class="number-list">${match}</ol>`;
    });

    // Headers
    text = text.replace(/^### (.+)$/gm, '<h3 class="header-3">$1</h3>');
    text = text.replace(/^## (.+)$/gm, '<h2 class="header-2">$1</h2>');
    text = text.replace(/^# (.+)$/gm, '<h1 class="header-1">$1</h1>');

    // Line breaks
    text = text.replace(/\n/g, '<br/>');

    return text;
  };

  return (
    <div 
      className="formatted-content"
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
    />
  );
};

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
          content: "عذراً، أواجه مشكلة في الرد الآن. يرجى المحاولة مرة أخرى.\nSorry, I'm having trouble responding right now. Please try again.",
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
        content: "عذراً، أواجه مشكلة في الرد الآن. يرجى المحاولة مرة أخرى.\nSorry, I'm having trouble responding right now. Please try again.",
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
      <style jsx global>{`
        .formatted-content {
          line-height: 1.6;
        }
        
        .code-block {
          margin: 12px 0;
          border-radius: 8px;
          background: #1e1e1e;
          overflow: hidden;
          border: 1px solid #333;
        }
        
        .code-lang {
          background: #333;
          color: #fff;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 500;
          border-bottom: 1px solid #444;
        }
        
        .code-block pre {
          margin: 0;
          padding: 16px;
          background: #1e1e1e;
          color: #f8f8f2;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          overflow-x: auto;
        }
        
        .code-block code {
          background: none;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
        
        .inline-code {
          background: rgba(156, 163, 175, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: #901b20;
          border: 1px solid rgba(156, 163, 175, 0.2);
        }
        
        .bullet-list, .number-list {
          margin: 12px 0;
          padding-left: 20px;
        }
        
        .bullet-item, .number-item {
          margin: 6px 0;
          color: inherit;
        }
        
        .bullet-list {
          list-style-type: disc;
        }
        
        .number-list {
          list-style-type: decimal;
        }
        
        .header-1, .header-2, .header-3 {
          margin: 16px 0 8px 0;
          font-weight: 600;
          color: #901b20;
        }
        
        .header-1 {
          font-size: 1.25rem;
          border-bottom: 2px solid rgba(144, 27, 32, 0.2);
          padding-bottom: 4px;
        }
        
        .header-2 {
          font-size: 1.125rem;
        }
        
        .header-3 {
          font-size: 1rem;
        }
        
        .formatted-content strong {
          font-weight: 600;
          color: #901b20;
        }
      `}</style>

      {/* Floating Chat Button */}
      <motion.button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-all duration-300 group border-2 border-white/20"
        whileHover={{ scale: 1.1, rotateY: 12 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaRobot size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-2 font-bold border-2 border-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}

        {/* Pulse animation for new messages */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute inset-0 bg-primary rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity: 0.4 }}
          />
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-92 h-[430px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col backdrop-blur-lg"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white p-5 rounded-t-3xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                  <FaRobot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ITIANS Assistant</h3>
                  <p className="text-xs opacity-90">Professional Guide</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <Link
                  href="/chatbot"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
                  title="Open Full Chatbot Page"
                >
                  <FaExternalLinkAlt size={16} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <FaTimes size={16} />
                </button>
              </div> */}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.length === 0 && showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FaRobot size={32} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Hello , Iam ITIANS' assistant</h3>
                  <p className="text-sm text-gray-600 mb-6 px-4">
 I'm here to help you maximize your professional potential on ITIANS. From profile optimization to career strategies, I provide expert guidance tailored for ITI graduates.                  </p>
                  
                  {/* Suggested Prompts */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 justify-center mb-3">
                      <FaLightbulb size={14} className="text-primary" />
                      <span>Try ask about ...</span>
                    </div>
                    {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(prompt)}
                        className="block w-full text-right p-3 bg-white hover:bg-primary/5 rounded-xl text-sm text-gray-700 transition-all duration-200 border border-gray-200 hover:border-primary/30 hover:shadow-sm"
                        dir="auto"
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
                          ? 'bg-primary text-white rounded-br-md'
                          : message.isError
                          ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-md'
                      }`}
                      dir="auto"
                    >
                      {message.type === 'bot' && !message.isError ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      <p className={`text-xs mt-3 ${
                        message.type === 'user' ? 'opacity-70' : 'text-gray-500'
                      }`}>
                        {message.timestamp?.toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    
                    {/* Copy button for bot messages */}
                    {message.type === 'bot' && !message.isError && (
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 shadow-sm"
                        title="Copy message"
                      >
                        <FaRegCopy size={12} className="text-gray-500" />
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
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking ...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-3xl">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full p-3 pr-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-gray-800 placeholder:text-gray-500"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    dir="auto"
                  />
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane size={16} />
                </motion.button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  <FaTrash size={10} />
Clear Conversation                </button>
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  {showSuggestions ? <FaChevronDown size={10} /> : <FaChevronUp size={10} />}
Suggestions                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;

