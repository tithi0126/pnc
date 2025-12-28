
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Star, Quote, Clock, Users, Check, ArrowRight, Target, Award, Heart, Scale, Building, Brain, Utensils } from "lucide-react";
import { servicesAPI, settingsAPI } from "@/lib/api";

interface Service {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  duration: string;
  ideal_for: string;
  benefits: string[];
  is_active: boolean;
  sort_order: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSettings, setPageSettings] = useState({
    services_page_title: 'Our Nutrition Services',
    services_page_subtitle: 'Comprehensive nutrition solutions for optimal health',
    services_page_intro: 'We offer a wide range of personalized nutrition services...',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch services
        const servicesData = await servicesAPI.getAll();
        if (!servicesData || !Array.isArray(servicesData)) {
          throw new Error('Invalid data format received from server');
        }

        // Filter and transform the services data
        const transformed = servicesData
          .filter((s: any) => s.isActive !== false && s.is_active !== false)
          .sort((a: any, b: any) => (a.sortOrder || a.sort_order || 0) - (b.sortOrder || b.sort_order || 0))
          .map((s: any) => ({
            id: s._id?.toString() || s.id || `service-${Date.now()}-${Math.random()}`,
            title: s.title || 'Untitled Service',
            short_description: s.shortDescription || s.short_description || 'No description available',
            full_description: s.fullDescription || s.full_description || '',
            icon: s.icon || 'Star',
            duration: s.duration || 'Duration not specified',
            ideal_for: s.idealFor || s.ideal_for || 'Suitable for all individuals',
            benefits: Array.isArray(s.benefits) ? s.benefits.filter(b => b && typeof b === 'string' && b.trim()) : [],
            is_active: s.isActive ?? s.is_active ?? true,
            sort_order: s.sortOrder || s.sort_order || 0,
          }));

        setServices(transformed);

        // Fetch settings
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        setPageSettings({
          services_page_title: settingsMap.services_page_title || pageSettings.services_page_title,
          services_page_subtitle: settingsMap.services_page_subtitle || pageSettings.services_page_subtitle,
          services_page_intro: settingsMap.services_page_intro || pageSettings.services_page_intro,
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load services');
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get gradient class based on index
  const getGradientClass = (index: number) => {
    const gradients = [
      "from-blue-500/20 to-purple-500/20",
      "from-green-500/20 to-teal-500/20",
      "from-orange-500/20 to-pink-500/20",
      "from-purple-500/20 to-indigo-500/20",
      "from-teal-500/20 to-blue-500/20",
      "from-pink-500/20 to-rose-500/20"
    ];
    return gradients[index % gradients.length];
  };

  // Function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      Heart: Heart,
      Scale: Scale,
      Building: Building,
      Brain: Brain,
      Utensils: Utensils,
      Target: Target,
      Users: Users,
      Award: Award,
      Clock: Clock,
      Check: Check,
      Star: Star,
      Apple: Star, // Default fallback
    };
    return iconMap[iconName] || Star;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading services...</p>
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
            <h3 className="text-xl font-semibold mb-2">Error Loading Services</h3>
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

  if (services.length === 0) {
    return (
      <Layout>
        <section className="pt-32 pb-20 bg-gradient-hero">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm uppercase tracking-wider mb-4">
                Our Services
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
                Expert Nutrition Services
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Professional nutrition guidance tailored to your unique health journey.
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">No Services Available</h2>
              <p className="text-muted-foreground mb-6">
                Services will be added soon. Please check back later or contact us for more information.
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
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm uppercase tracking-wider mb-4">
              Our Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {pageSettings.services_page_title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {pageSettings.services_page_subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our complete range of nutrition services, each designed with your health goals in mind.
            </p>
          </div>

          <div className="space-y-8 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const Icon = getIconComponent(service.icon);
              
              return (
                <div
                  key={service.id}
                  className="relative bg-gradient-to-br from-card to-card/80 rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-up overflow-hidden border border-border"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                  
                  <div className="relative">
                    <div className="flex flex-col lg:flex-row items-start justify-between mb-8">
                      <div className="flex items-center gap-4 mb-6 lg:mb-0">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getGradientClass(index)}`}>
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-2xl text-foreground">
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {service.duration}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              {service.ideal_for}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <Quote className="w-12 h-12 text-primary/30 mb-6" />
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                          {service.short_description || service.full_description || 'Detailed information about this service will be provided upon consultation.'}
                        </p>

                        {service.benefits && service.benefits.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-foreground text-lg">Key Benefits:</h4>
                            <ul className="space-y-2">
                              {service.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-foreground text-lg">Service Overview:</h4>
                            <p className="text-muted-foreground leading-relaxed">
                              This comprehensive service is designed to meet your specific nutritional needs and health goals.
                              Contact us for personalized consultation and detailed benefits.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-border/50">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                              <span className="font-medium">Duration</span>
                              <span className="text-primary font-semibold">{service.duration}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                              <span className="font-medium">Ideal For</span>
                              <span className="text-primary font-semibold">{service.ideal_for}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                              <span className="font-medium">Rating</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                                <span className="ml-2 font-semibold">5.0</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              We combine expertise with personalized care to deliver exceptional results
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                1000+
              </div>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                15+
              </div>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                98%
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
