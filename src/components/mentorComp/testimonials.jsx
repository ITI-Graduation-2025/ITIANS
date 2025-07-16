import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const mockTestimonials = [
  {
    id: 1,
    name: "John Doe",
    review:
      "Great session! Moe provided excellent insights into product management strategies.",
    rating: 5,
    role: "Product Designer",
  },
  {
    id: 2,
    name: "Jane Smith",
    review:
      "Very insightful discussion about career growth in tech. Highly recommend!",
    rating: 5,
    role: "Software Engineer",
  },
  {
    id: 3,
    name: "Alex Johnson",
    review:
      "Fantastic mentor with deep industry knowledge. Helped me navigate my career transition.",
    rating: 5,
    role: "Marketing Manager",
  },
];

export function Testimonials() {
  return (
    <div className="bg-[var(--muted)] py-8 sm:py-12">
      <div className="max-w-full sm:max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-6 sm:mb-8">
          What mentees say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {mockTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-[var(--card)] border-[var(--border)]"
            >
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center mb-2 sm:mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 sm:w-4 h-3 sm:h-4 fill-[var(--primary)] text-[var(--primary)]"
                    />
                  ))}
                </div>
                <p className="text-[var(--muted-foreground)] text-sm sm:text-base mb-3 sm:mb-4">
                  "{testimonial.review}"
                </p>
                <div>
                  <p className="font-medium text-[var(--foreground)] text-sm sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
