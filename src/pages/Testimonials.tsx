import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialsAPI, settingsAPI } from "@/lib/api";
import { normalizeImageUrl } from "@/utils/imageUrl";

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
  const [error, setError] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState({
    testimonials_page_title: 'Client Success Stories',
    testimonials_page_subtitle: 'Real transformations, real results',
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await testimonialsAPI.getAll();

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // Transform and validate MongoDB data
        const transformed = data
          .filter((t: any) => t.isApproved !== false && t.is_approved !== false) // Include testimonials that are not explicitly unapproved
          .sort((a: any, b: any) => {
            // Sort featured testimonials first, then by creation date
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          })
          .map((t: any) => ({
            id: t._id?.toString() || t.id || `testimonial-${Date.now()}-${Math.random()}`,
            name: t.name || 'Anonymous',
            role: t.role || null,
            location: t.location || null,
            content: t.content || 'No testimonial content available',
            rating: Math.max(1, Math.min(5, t.rating || 5)), // Ensure rating is between 1-5
            image_url: normalizeImageUrl(t.imageUrl || t.image_url || null),
            is_featured: t.isFeatured ?? t.is_featured ?? false,
          }));

        setTestimonials(transformed);

        // Fetch settings
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        setPageSettings({
          testimonials_page_title: settingsMap.testimonials_page_title || pageSettings.testimonials_page_title,
          testimonials_page_subtitle: settingsMap.testimonials_page_subtitle || pageSettings.testimonials_page_subtitle,
        });

        // Reset active index if it's out of bounds
        if (transformed.length > 0 && activeIndex >= transformed.length) {
          setActiveIndex(0);
        }

      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setError(error instanceof Error ? error.message : 'Failed to load testimonials');
        setTestimonials([]);
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-destructive mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Testimonials</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (testimonials.length === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-16 bg-gradient-hero">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
                Client Success Stories
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Hear what our clients have to say about their transformation journey.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Quote className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No Testimonials Yet</h2>
              <p className="text-muted-foreground mb-6">
                Testimonials will be added soon. Check back later to read success stories from our clients.
              </p>
            </div>
          </div>
        </section>
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
              {pageSettings.testimonials_page_title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageSettings.testimonials_page_subtitle}
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      {testimonials[activeIndex].image_url ? (
                        <img
                          src={normalizeImageUrl(testimonials[activeIndex].image_url)}
                          alt={testimonials[activeIndex].name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full rounded-full bg-primary/10 flex items-center justify-center"><span class="text-primary font-semibold text-lg">${testimonials[activeIndex].name.charAt(0).toUpperCase()}</span></div>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-primary font-semibold text-lg">
                          {testimonials[activeIndex].name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">
                        {testimonials[activeIndex].name}
                      </h3>
                      <p className="text-muted-foreground">
                        {[testimonials[activeIndex].role, testimonials[activeIndex].location].filter(Boolean).join(' • ') || 'Client'}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    {testimonial.image_url ? (
                      <img
                        src={normalizeImageUrl(testimonial.image_url)}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-primary font-semibold">${testimonial.name.charAt(0).toUpperCase()}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-primary font-semibold">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role || 'Client'}</p>
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
