import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";
import { normalizeImageUrl } from "@/utils/imageUrl";
import doctorPortrait from "@/assets/doctor-portrait.jpg";

const AboutPreview = () => {
  const [settings, setSettings] = useState({
    about_title: 'Passionate About Transforming Lives Through Nutrition',
    about_description_1: 'With over 15 years of experience in clinical nutrition and wellness consulting, Dr. Bidita Shah has helped thousands of individuals achieve their health goals through personalized nutrition strategies and sustainable lifestyle changes.',
    about_description_2: 'Her holistic approach combines cutting-edge nutritional science with practical, real-world solutions that fit seamlessly into your daily life. Whether you\'re looking to manage weight, improve athletic performance, or address specific health concerns, Dr. Shah provides the guidance and support you need.',
    about_credentials: JSON.stringify(['Ph.D. in Nutrition Science', 'Certified Dietitian', 'Sports Nutrition Expert', 'Published Author']),
    about_image_url: '',
    logo_url: '/pnc-logo.svg',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Use public settings API that doesn't require authentication
        const publicSettings = await settingsAPI.getPublic();
        const settingsMap: any = publicSettings || {};

        setSettings({
          about_title: settingsMap.about_title || settings.about_title,
          about_description_1: settingsMap.about_description_1 || settings.about_description_1,
          about_description_2: settingsMap.about_description_2 || settings.about_description_2,
          about_credentials: settingsMap.about_credentials || settings.about_credentials,
          about_image_url: settingsMap.about_image_url || settings.about_image_url,
          logo_url: settingsMap.logo_url || settings.logo_url,
        });
      } catch (error) {
        console.error('Error loading about settings:', error);
        // Settings will fall back to default values defined above
      }
    };
    loadSettings();
  }, []);

  const credentials = JSON.parse(settings.about_credentials || '[]');

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative animate-fade-up">
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img
                src={normalizeImageUrl(settings.about_image_url) || 'https://images.unsplash.com/800x600/?portrait,doctor,medical&w=400&h=500&fit=crop&crop=face'}
                alt="Dr. Bidita Shah"
                className="w-full h-auto aspect-[4/5] object-cover"
                onError={(e) => {
                  // Fallback to static image if dynamic image fails
                  const target = e.target as HTMLImageElement;
                  if (target.src !== doctorPortrait) {
                    target.src = doctorPortrait;
                  }
                }}
              />
              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-medium">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center overflow-hidden">
                    <img
                      src={settings.logo_url}
                      alt="PNC Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to "PNC" text if logo fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('span');
                        fallback.className = 'font-heading text-lg text-primary font-bold';
                        fallback.textContent = 'PNC';
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">Dr. Bidita Shah</h4>
                    <p className="text-sm text-muted-foreground">Nutrition Consultant & Food Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl bg-primary/10" />
          </div>

          {/* Content */}
          <div className="animate-fade-up animation-delay-200">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About Dr. Bidita Shah</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {settings.about_title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {settings.about_description_1}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {settings.about_description_2}
            </p>

            {/* Credentials */}
            {credentials.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {credentials.map((credential: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{credential}</span>
                  </div>
                ))}
              </div>
            )}

            <Link to="/about" className="btn-primary inline-flex items-center gap-2">
              Learn More About Me
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
