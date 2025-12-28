import { Link } from "react-router-dom";
import { ArrowRight, Phone, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const CTASection = () => {
  const [settings, setSettings] = useState({
    cta_title: 'Ready to Start Your Wellness Journey?',
    cta_description: 'Take the first step towards a healthier you. Book a consultation today and discover how personalized nutrition can transform your life.',
    phone_number: '+1 234 567 890',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        
        setSettings({
          cta_title: settingsMap.cta_title || settings.cta_title,
          cta_description: settingsMap.cta_description || settings.cta_description,
          phone_number: settingsMap.phone_number || settings.phone_number,
        });
      } catch (error) {
        console.error('Error loading CTA settings:', error);
      }
    };
    loadSettings();
  }, []);

  const phoneLink = `tel:${settings.phone_number.replace(/\s/g, '')}`;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-cta p-12 md:p-16 lg:p-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="leaf-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#leaf-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 animate-fade-up">
              {settings.cta_title}
            </h2>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-10 animate-fade-up animation-delay-100">
              {settings.cta_description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-200">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={phoneLink}
                className="inline-flex items-center gap-2 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary-foreground/10 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
