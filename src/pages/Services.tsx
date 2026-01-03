import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Quote, Clock, Users, Check, ArrowRight, Target, Award, Heart, Scale, Building, Brain, Utensils, Calendar, Phone, Mail, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { servicesAPI, settingsAPI } from "@/lib/api";
import { colors } from "@/theme/colors";

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
  const [contactSettings, setContactSettings] = useState({
    contact_email: 'drbiditashah@gmail.com',
    phone_number: '+91 9876543210',
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

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
        setContactSettings({
          contact_email: settingsMap.contact_email || contactSettings.contact_email,
          phone_number: settingsMap.phone_number || contactSettings.phone_number,
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
        {/* <section className="pt-32 pb-20 bg-gradient-hero">
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
        
        
        */
        <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Services</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {pageSettings.services_page_title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageSettings.services_page_subtitle}
            </p>
          </div>
        </div>
      </section>

        }

        <section className="section-padding">
          <div className="container-custom text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">No Services Available</h2>
              <p className="text-muted-foreground mb-6">
                Services will be added soon. Please check back later or contact us for more information.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Get featured services (first 2-3)
  const featuredServices = services.slice(0, Math.min(3, services.length));

  // Create contact links
  const phoneLink = `tel:${contactSettings.phone_number.replace(/\s/g, '')}`;
  const emailLink = `mailto:${contactSettings.contact_email}`;

  // Button handlers
  const handleBookService = (serviceId: string) => {
    // Navigate to contact page with service info
    window.location.href = `/contact?service=${serviceId}`;
  };

  const handleCallNow = () => {
    window.open(phoneLink, '_self');
  };

  const handleEmailInquiry = () => {
    window.open(emailLink, '_self');
  };

  const toggleDescription = (serviceId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Services</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {pageSettings.services_page_title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageSettings.services_page_subtitle}
            </p>
            
            {/* Quick Stats */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">{services.length}</div>
                <div className="text-sm text-gray-600">Total Services</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">{featuredServices.length}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-gray-600">Personalized</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our most popular and comprehensive nutrition services
            </p>
          </div>

          <div className="w-full">
            {featuredServices.map((service, index) => {
              const Icon = getIconComponent(service.icon);

              return (
                <div
                  key={service.id}
                  className="relative bg-card rounded-none px-4 py-8 md:px-8 mb-12 last:mb-0 shadow-xl overflow-hidden border-l-0 border-r-0 border-t border-b border-border"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Service Details */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-6 mb-6">
                        <div className={`p-5 rounded-2xl bg-gradient-to-br ${getGradientClass(index)} shadow-lg`}>
                          <Icon className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-bold text-3xl text-foreground mb-3">
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className={`flex items-center gap-2 px-3 py-1.5 text-primary rounded-full text-sm font-semibold border border-primary/20`}>
                              <Clock className="w-4 h-4" />
                              {service.duration}
                            </div>
                            {service.ideal_for && service.ideal_for !== 'Suitable for all individuals' && (
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                                <Users className="w-4 h-4" />
                                <span className="max-w-[200px] truncate" title={service.ideal_for}>
                                  {service.ideal_for}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Service Description */}
                      <div className="mb-6">
                        <Quote className="w-12 h-12 text-primary/30 mb-4" />
                        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                          {service.short_description || service.full_description || 'Detailed information about this service will be provided upon consultation.'}
                        </p>

                        {service.full_description && service.full_description !== service.short_description && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleDescription(service.id)}
                              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                              <span>Read More</span>
                              {expandedDescriptions[service.id] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>

                            {expandedDescriptions[service.id] && (
                              <div className="mt-3 p-4 bg-muted/30 rounded-lg border border-border">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                  {service.full_description}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Benefits Section */}
                      {service.benefits && service.benefits.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground text-xl">Key Benefits:</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {service.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10">
                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-foreground leading-relaxed font-medium">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Right Column - Service Card & CTA */}
                    <div className="space-y-8">
                      {/* Service Details Card */}
                      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-lg">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-primary" />
                              <span className="font-semibold text-foreground">Duration</span>
                            </div>
                            <span className="text-primary font-bold text-sm">{service.duration}</span>
                          </div>

                          <div className="p-4 bg-card rounded-xl border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-5 h-5 text-primary" />
                              <span className="font-semibold text-foreground">Ideal For</span>
                            </div>
                            <div className="text-primary font-medium leading-relaxed break-words max-h-20 overflow-y-auto text-sm">
                              {service.ideal_for}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                            <div className="flex items-center gap-2">
                              <Star className={`w-5 h-5 ${colors.servicesRatingStar}`} />
                              <span className="font-semibold text-foreground">Rating</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${colors.servicesRatingStarFilled}`} />
                              ))}
                              <span className={`ml-2 font-bold text-sm ${colors.servicesRatingValue}`}>5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Section */}
                      <div className="space-y-4">
                        <button
                          onClick={() => handleBookService(service.id)}
                          className="w-full py-4 bg-gradient-to-r from-primary via-primary to-accent text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                        >
                          <Calendar className="w-6 h-6" />
                          <span>Book This Service</span>
                          <ArrowRight className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center space-y-3">
                          <p className="text-sm text-muted-foreground">
                            <Check className={`w-4 h-4 inline mr-2 ${colors.servicesCtaGuaranteeIcon}`} />
                            Personalized consultation • Professional guidance • Proven results
                          </p>
                          <div className="flex items-center justify-center gap-4 text-sm">
                            <button
                              onClick={handleCallNow}
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              <Phone className="w-4 h-4" />
                              Call Now
                            </button>
                            <button
                              onClick={handleEmailInquiry}
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              <Mail className="w-4 h-4" />
                              Email Inquiry
                            </button>
                          </div>
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
      <section className="section-padding bg-muted/30">
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
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${colors.servicesStatsGradientClients}`}>
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                1000+
              </div>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
            </div>

              <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${colors.servicesStatsGradientAwards}`}>
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                15+
              </div>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>

              <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${colors.servicesStatsGradientSuccess}`}>
                <Check className="w-8 h-8 text-primary" />
              </div>
              <div className="font-heading text-3xl font-bold text-foreground mb-2">
                98%
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>

              <div className="bg-card p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${colors.servicesStatsGradientSupport}`}>
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

      {/* CTA Section */}
      {/* <section className="section-padding bg-gradient-to-r from-primary to-accent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today for a personalized consultation and discover how our services can transform your health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5" />
                Book Free Consultation
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center gap-3 border border-white/30">
                <Phone className="w-5 h-5" />
                Call: (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Services;