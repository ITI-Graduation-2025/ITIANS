"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CardCarousel({
  items = [],
  autoplayDelay = 4000,
  showNavigation = true,
  showPagination = true,
}) {
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    if (startIndex + 3 >= items.length) {
      setStartIndex(0);
    } else {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex === 0) {
      setStartIndex(Math.max(0, items.length - 3));
    } else {
      setStartIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!autoplayDelay || items.length <= 3) return;
    const timer = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplayDelay, items.length, startIndex]);

  if (!items.length) return null;

  const visibleItems = [
    items[startIndex],
    items[(startIndex + 1) % items.length],
    items[(startIndex + 2) % items.length],
  ];

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-center gap-6 px-8 py-8">
        {visibleItems.map((item, index) => {
          const isCenter = index === 1;
          return (
            <motion.div
              key={`${startIndex}-${index}`}
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isCenter ? 1.03 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{
                scale: isCenter ? 1.01 : 1.05,
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              {item?.content}
            </motion.div>
          );
        })}
      </div>

      {showNavigation && items.length > 3 && (
        <>
          <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
            size="icon"
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl z-10"
            size="icon"
            variant="outline"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {showPagination && items.length > 3 && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: Math.max(1, items.length - 2) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === startIndex
                    ? "bg-[var(--primary)] w-8"
                    : "bg-gray-300 hover:bg-gray-400 w-2"
                }`}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
