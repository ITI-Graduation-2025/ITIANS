"use client";

import { useState, useEffect } from "react";

export const AnimatedLoader = ({ 
  type = "pulse", 
  size = "default", 
  text = "Loading...",
  showText = true,
  className = "",
  variant = "default"
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
    xl: "text-xl"
  };

  const renderLoader = () => {
    switch (type) {
      case "pulse":
        return (
          <div className={`${sizeClasses[size]} animate-pulse bg-gradient-to-r from-[#B71C1C] to-red-600 rounded-full`} />
        );
      
      case "spin":
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#B71C1C] animate-spin"></div>
          </div>
        );
      
      case "bounce":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-[#B71C1C] rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case "wave":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-[#B71C1C] rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case "ripple":
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 rounded-full bg-[#B71C1C] animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full bg-[#B71C1C]"></div>
          </div>
        );
      
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-[#B71C1C] rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-[#B71C1C]`} />
        );
    }
  };

  const renderContent = () => {
    const baseContent = (
      <div className={`flex flex-col items-center justify-center space-y-4 animate-fade-in-up ${className}`}>
        <div className="animate-bounce-in">
          {renderLoader()}
        </div>
        {showText && (
          <div className={`text-center animate-slide-in-left ${textSizes[size]}`}>
            <p className="text-gray-600 font-medium">{text}</p>
            {type === "dots" && (
              <p className="text-gray-500 text-sm mt-1 animate-pulse">Please wait{dots}</p>
            )}
          </div>
        )}
      </div>
    );

    // Full page height minus navbar and footer
    const fullPageStyle = "h-[calc(100vh-120px)] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center";

    if (variant === "page") {
      return (
        <div className={fullPageStyle}>
          <div className="text-center animate-scale-in">
            {baseContent}
            <div className="mt-8 text-gray-500 text-sm animate-slide-in-right">
              <div className="animate-pulse">This won't take long...</div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#B71C1C] to-red-600 rounded-full animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "redirect") {
      return (
        <div className={fullPageStyle}>
          <div className="text-center animate-scale-in">
            {baseContent}
            <div className="mt-6 text-gray-500 text-sm animate-slide-in-right">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#B71C1C] rounded-full animate-bounce animate-pulse-glow"></div>
                <div className="w-2 h-2 bg-[#B71C1C] rounded-full animate-bounce animate-pulse-glow" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#B71C1C] rounded-full animate-bounce animate-pulse-glow" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 animate-fade-in-up">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-1 h-1 bg-[#B71C1C] rounded-full"></div>
                <div className="w-1 h-1 bg-[#B71C1C] rounded-full"></div>
                <div className="w-1 h-1 bg-[#B71C1C] rounded-full"></div>
                <span className="ml-2">Preparing your profile</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // For default variant, also use full page height
    return (
      <div className={fullPageStyle}>
        {baseContent}
      </div>
    );
  };

  return renderContent();
};
