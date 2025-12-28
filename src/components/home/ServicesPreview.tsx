import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Apple, Dumbbell, Heart, Briefcase, Sparkles, Baby, Scale, Building } from "lucide-react";
import { servicesAPI, settingsAPI } from "@/lib/api";

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Dumbbell,
  Heart,
  Briefcase,
  Sparkles,
  Baby,
  Scale,
  Building,
};

interface Service {
  id: string;
  title: string;
  short_description: string;
  icon: string | null;
}

const ServicesPreview = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState({
    services_title: 'Comprehensive Nutrition Services',
    services_subtitle: 'Tailored solutions for your unique health and wellness goals',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesData = await servicesAPI.getAll();
        const transformed = (servicesData || [])
          .filter((s: any) => s.isActive)
          .slice(0, 3)
          .map((s: any) => ({
            id: s._id?.toString() || s.id || '',
            title: s.title || '',
            short_description: s.shortDescription || s.short_description || '',
            icon: s.icon || '',
          }));
        setServices(transformed);

        // Fetch settings
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        setSettings({
          services_title: settingsMap.services_title || settings.services_title,
          services_subtitle: settingsMap.services_subtitle || settings.services_subtitle,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            {settings.services_title}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {settings.services_subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || "Apple"] || Apple;
            return (
              <div
                key={service.id}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-large transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gradient-cta group-hover:text-primary-foreground transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.short_description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up">
          <Link to="/services" className="btn-outline inline-flex items-center gap-2">
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
