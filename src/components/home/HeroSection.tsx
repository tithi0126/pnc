import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Award, Users, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";
import { normalizeImageUrl } from "@/utils/imageUrl";

const HeroSection = () => {
  const [settings, setSettings] = useState({
    hero_badge: 'Nutrition & Wellness Expert',
    hero_title: 'Transform Your Health with Expert Nutrition Guidance',
    hero_title_highlight: 'Expert Nutrition',
    hero_subtitle: 'Personalized nutrition plans tailored to your unique needs. Achieve your wellness goals with science-backed strategies and compassionate support from Dr. Bidita Shah.',
    stat_clients: '5003+',
    stat_experience: '15+',
    stat_success: '98%',
    hero_image_url: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const publicSettings = await settingsAPI.getPublic();
        const settingsMap: any = publicSettings || {};

        setSettings({
          hero_badge: settingsMap.hero_badge || settings.hero_badge,
          hero_title: settingsMap.hero_title || settings.hero_title,
          hero_title_highlight: settingsMap.hero_title_highlight || settings.hero_title_highlight,
          hero_subtitle: settingsMap.hero_subtitle || settings.hero_subtitle,
          stat_clients: settingsMap.stat_clients || settings.stat_clients,
          stat_experience: settingsMap.stat_experience || settings.stat_experience,
          stat_success: settingsMap.stat_success || settings.stat_success,
          hero_image_url: settingsMap.hero_image_url || settings.hero_image_url,
        });
      } catch (error) {
        console.error('Error loading hero settings:', error);
      }
    };
    loadSettings();
  }, []);

  const renderTitle = () => {
    if (settings.hero_title.includes(settings.hero_title_highlight)) {
      const parts = settings.hero_title.split(settings.hero_title_highlight);
      return (
        <>
          {parts[0]}
          <span className="text-primary">{settings.hero_title_highlight}</span>
          {parts[1]}
        </>
      );
    }
    return settings.hero_title;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={normalizeImageUrl(settings.hero_image_url) || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=1080&fit=crop'}
          alt="Dr. Bidita Shah - Nutrition Consultant"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('unsplash.com')) {
              target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=1080&fit=crop';
            }
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
      </div>

      <div className="container-custom relative z-10 px-4 py-8 md:py-16 lg:py-24">
        {/* Main Content - Centered */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 md:mb-6">
            <Leaf className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-primary">{settings.hero_badge}</span>
          </div>

          {/* Main Heading - Centered with reduced font size */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight md:leading-tight lg:leading-tight mb-4 md:mb-6">
            {renderTitle()}
          </h1>

          {/* Subtitle - Full width with proper spacing */}
          <div className="mb-8 md:mb-12">
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed md:leading-relaxed max-w-3xl mx-auto px-4">
              {settings.hero_subtitle}
            </p>
          </div>

          {/* CTA Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link 
              to="/contact" 
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm md:text-base px-5 py-3 md:px-8 md:py-4 min-w-[200px]"
            >
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/services" 
              className="btn-outline inline-flex items-center justify-center gap-2 text-sm md:text-base px-5 py-3 md:px-8 md:py-4 min-w-[200px]"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default HeroSection;