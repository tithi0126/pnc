import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialsAPI } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
  is_featured: boolean | null;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Testimonials page: Fetching testimonials...');
        const data = await testimonialsAPI.getAll();
        console.log('Testimonials page: Raw data received:', data?.length || 0, 'testimonials');

        // Transform MongoDB data to match interface
        const transformed = (data || []).map((t: any) => ({
          id: t._id?.toString() || t.id || '',
          name: t.name || '',
          role: t.role || '',
          location: t.location || '',
          content: t.content || '',
          rating: t.rating || 5,
          image_url: t.imageUrl || t.image_url || '',
          is_featured: t.isFeatured ?? t.is_featured ?? false,
        }));

        console.log('Testimonials page: Transformed testimonials:', transformed.length);
        setTestimonials(transformed);
      } catch (error) {
        console.error('Testimonials page: Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Success Stories That Inspire
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Real experiences from real clients who have transformed their health and lives through 
              personalized nutrition guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-card rounded-3xl p-8 md:p-12 shadow-large animate-fade-up">
                <Quote className="w-16 h-16 text-primary/20 mb-6" />
                
                <p className="font-heading text-xl md:text-2xl text-foreground leading-relaxed mb-8">
                  "{testimonials[activeIndex].content}"
                </p>

                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    {testimonials[activeIndex].image_url && (
                      <img
                        src={testimonials[activeIndex].image_url}
                        alt={testimonials[activeIndex].name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {testimonials[activeIndex].name}
                      </h3>
                      <p className="text-muted-foreground">
                        {testimonials[activeIndex].role} • {testimonials[activeIndex].location}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonials[activeIndex].rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevTestimonial}
                      className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === activeIndex ? "bg-primary" : "bg-border"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Testimonials Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              More Client Stories
            </h2>
            <p className="text-muted-foreground">Every success story motivates us to keep making a difference.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-medium transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-foreground/80 leading-relaxed mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
