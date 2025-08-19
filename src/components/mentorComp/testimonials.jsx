"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getMentorTestimonials } from "@/services/mentorshipService";

export function Testimonials({ mentorId }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!mentorId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMentorTestimonials(mentorId);
        setTestimonials(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [mentorId]);

  // Calculate how many slides we need
  const totalSlides = Math.ceil(testimonials.length / 3);
  const hasMultipleSlides = totalSlides > 1;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [totalSlides, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [totalSlides, isTransitioning]);

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!hasMultipleSlides || !isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [hasMultipleSlides, isAutoPlaying, nextSlide]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[var(--muted)] to-[var(--background)] py-8 sm:py-12">
        <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 sm:mb-8">
            What mentees say
          </h2>
          <div className="text-center text-[var(--muted-foreground)]">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
              <span>Loading testimonials...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[var(--muted)] to-[var(--background)] py-8 sm:py-12">
        <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 sm:mb-8">
            What mentees say
          </h2>
          <div className="text-center text-[var(--muted-foreground)]">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[var(--muted)] to-[var(--background)] py-8 sm:py-12">
        <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 sm:mb-8">
            What mentees say
          </h2>
          <div className="text-center text-[var(--muted-foreground)]">
            No testimonials yet. Be the first to leave a review after your
            session!
          </div>
        </div>
      </div>
    );
  }

  const currentTestimonials = getCurrentTestimonials();

  return (
    <div className="bg-gradient-to-br from-[var(--muted)] to-[var(--background)] py-8 sm:py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--primary)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[var(--primary)] rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 sm:mb-8">
          What mentees say
        </h2>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Auto-play control */}
          {hasMultipleSlides && (
            <div className="flex justify-center mb-6">
              <button
                onClick={toggleAutoPlay}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--muted)] transition-all duration-300 hover:scale-105"
                aria-label={
                  isAutoPlaying ? "Pause auto-scroll" : "Start auto-scroll"
                }
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4 text-[var(--foreground)]" />
                ) : (
                  <Play className="w-4 h-4 text-[var(--foreground)]" />
                )}
                <span className="text-sm text-[var(--foreground)]">
                  {isAutoPlaying ? "Pause" : "Play"}
                </span>
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {hasMultipleSlides && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 bg-gradient-to-r from-[var(--card)] to-[var(--muted)] border border-[var(--border)] rounded-full p-3 hover:scale-110 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 bg-gradient-to-l from-[var(--card)] to-[var(--muted)] border border-[var(--border)] rounded-full p-3 hover:scale-110 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors" />
              </button>
            </>
          )}

          {/* Testimonials Grid with smooth transitions */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-500 ${isTransitioning ? "opacity-75 scale-95" : "opacity-100 scale-100"}`}
          >
            {currentTestimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)] border-[var(--border)] hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group overflow-hidden relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                {/* Card accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardContent className="pt-6 p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)] transition-transform duration-300 group-hover:scale-110"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-[var(--muted-foreground)] text-sm sm:text-base mb-4 leading-relaxed italic">
                    "{testimonial.review}"
                  </p>
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="font-semibold text-[var(--foreground)] text-sm sm:text-base mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-2">
                      {testimonial.role}
                    </p>
                    {testimonial.sessionTitle && (
                      <p className="text-xs text-[var(--primary)] font-medium">
                        📚 {testimonial.sessionTitle}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Slide Indicators */}
          {hasMultipleSlides && (
            <div className="flex justify-center mt-8 space-x-3">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentSlide
                      ? "bg-[var(--primary)] shadow-lg shadow-[var(--primary)]/50 scale-125"
                      : "bg-[var(--muted-foreground)] hover:bg-[var(--foreground)]"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Enhanced Testimonial Counter */}
          {hasMultipleSlides && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)]">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {currentSlide + 1}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  of
                </span>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {totalSlides}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
