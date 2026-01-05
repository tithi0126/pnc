import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Award, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";
import { normalizeImageUrl } from "@/utils/imageUrl";
// Note: heroImage is now loaded dynamically from settings

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
        // Use public settings API that doesn't require authentication
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
        // Settings will fall back to default values defined above
      }
    };
    loadSettings();
  }, []);

  // Render title with highlight - if highlight text is in title, split and highlight it
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={normalizeImageUrl(settings.hero_image_url) || 'https://images.unsplash.com/1600x1200/?nutrition,health,wellness&w=1600&h=1200&fit=crop'}
          alt="Dr. Bidita Shah - Nutrition Consultant"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to static image if dynamic image fails
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('unsplash.com')) {
              target.src = 'https://images.unsplash.com/1600x1200/?nutrition,health,wellness&w=1600&h=1200&fit=crop';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      </div>

      <div className="container-custom relative z-10 pt-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{settings.hero_badge}</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
            {renderTitle()}
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-8 animate-fade-up animation-delay-200">
            {settings.hero_subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up animation-delay-300">
            <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2 text-base">
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="btn-outline inline-flex items-center justify-center gap-2 text-base">
              Explore Services
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 animate-fade-up animation-delay-400">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">{settings.stat_clients}</span>
              </div>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">{settings.stat_experience}</span>
              </div>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">{settings.stat_success}</span>
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
