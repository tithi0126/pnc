import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, Star } from "lucide-react";
import { testimonialsAPI } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
}

const TestimonialsPreview = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('TestimonialsPreview: Fetching testimonials...');
        const data = await testimonialsAPI.getAll();
        console.log('TestimonialsPreview: Raw data received:', data?.length || 0, 'testimonials');

        // Transform MongoDB data, filter for featured, and limit to 3
        const transformed = (data || [])
          .filter((t: any) => t.isFeatured ?? t.is_featured ?? false)
          .slice(0, 3)
          .map((t: any) => ({
            id: t._id?.toString() || t.id || '',
            name: t.name || '',
            role: t.role || '',
            content: t.content || '',
            rating: t.rating || 5,
            image_url: t.imageUrl || t.image_url || '',
          }));

        console.log('TestimonialsPreview: Featured testimonials for homepage:', transformed.length);
        setTestimonials(transformed);
      } catch (error) {
        console.error('TestimonialsPreview: Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Real stories from real people who have transformed their lives through our personalized 
            nutrition programs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl bg-card shadow-medium animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.image_url && (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up">
          <Link to="/testimonials" className="btn-outline inline-flex items-center gap-2">
            View All Testimonials
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
