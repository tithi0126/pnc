import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Award, BookOpen, Target, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";
import { normalizeImageUrl } from "@/utils/imageUrl";
// Note: doctorPortrait is now loaded dynamically from settings

const About = () => {
  const [settings, setSettings] = useState({
    about_page_title: 'Dedicated to Transforming Lives Through Nutrition',
    about_page_subtitle: 'A journey of passion, expertise, and commitment to helping individuals achieve optimal health.',
    about_story_title: 'My Story',
    about_story_paragraph_1: 'My journey into nutrition began with a personal health transformation that changed my life. After experiencing firsthand the power of proper nutrition, I dedicated my career to helping others discover the same transformative potential.',
    about_story_paragraph_2: 'With over 15 years of clinical experience, I\'ve had the privilege of working with thousands of individuals—from professional athletes seeking peak performance to families looking for healthier lifestyles. Each client\'s success story fuels my passion for this field.',
    about_story_paragraph_3: 'As a food entrepreneur, I\'ve also worked with numerous restaurants and food businesses, helping them create nutritious yet delicious offerings. My approach bridges the gap between scientific nutrition and culinary excellence.',
    about_mission: 'To empower individuals with the knowledge and tools they need to achieve lasting health through personalized nutrition strategies that work for their unique lives.',
    about_vision: 'A world where everyone has access to expert nutrition guidance and where healthy eating is both accessible and enjoyable for all.',
    about_page_credentials: JSON.stringify([
      'Ph.D. in Clinical Nutrition - University of Surat',
      'Certified Dietitian (RD) - Indian Dietetic Association',
      'Sports Nutrition Specialist - International Society of Sports Nutrition',
      'Certified Diabetes Educator',
      'Member - Indian Medical Association'
    ]),
    about_page_achievements: JSON.stringify([
      { number: '5003+', label: 'Clients Helped' },
      { number: '15+', label: 'Years Experience' },
      { number: '12', label: 'Awards Won' },
      { number: '50+', label: 'Corporate Partners' }
    ]),
    about_core_values_title: 'Core Values',
    about_core_values_subtitle: 'The principles that guide every consultation and recommendation.',
    about_image_url: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        
        setSettings({
          about_page_title: settingsMap.about_page_title || settings.about_page_title,
          about_page_subtitle: settingsMap.about_page_subtitle || settings.about_page_subtitle,
          about_story_title: settingsMap.about_story_title || settings.about_story_title,
          about_story_paragraph_1: settingsMap.about_story_paragraph_1 || settings.about_story_paragraph_1,
          about_story_paragraph_2: settingsMap.about_story_paragraph_2 || settings.about_story_paragraph_2,
          about_story_paragraph_3: settingsMap.about_story_paragraph_3 || settings.about_story_paragraph_3,
          about_mission: settingsMap.about_mission || settings.about_mission,
          about_vision: settingsMap.about_vision || settings.about_vision,
          about_page_credentials: settingsMap.about_page_credentials || settings.about_page_credentials,
          about_page_achievements: settingsMap.about_page_achievements || settings.about_page_achievements,
          about_core_values_title: settingsMap.about_core_values_title || settings.about_core_values_title,
          about_core_values_subtitle: settingsMap.about_core_values_subtitle || settings.about_core_values_subtitle,
          about_image_url: settingsMap.about_image_url || settings.about_image_url,
        });

      } catch (error) {
        console.error('Error loading about page settings:', error);
      }
    };
    loadSettings();
  }, []);

  const credentials = JSON.parse(settings.about_page_credentials || '[]');
  const achievements = JSON.parse(settings.about_page_achievements || '[]');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About Dr. Bidita Shah</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {settings.about_page_title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {settings.about_page_subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Image Column */}
            <div className="animate-fade-up">
              <div className="relative">
                <img
                  src={normalizeImageUrl(settings.about_image_url) || 'https://images.unsplash.com/800x600/?portrait,doctor,medical&w=400&h=500&fit=crop&crop=face'}
                  alt="Dr. Bidita Shah"
                  className="w-full rounded-2xl shadow-large"
                  onError={(e) => {
                    // Fallback to static image if dynamic image fails
                    const target = e.target as HTMLImageElement;
                    if (target.src !== doctorPortrait) {
                      target.src = doctorPortrait;
                    }
                  }}
                />
                <div className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl bg-primary/10 -z-10" />
              </div>

              {/* Stats Grid */}
              {achievements.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-12">
                  {achievements.map((achievement: any, index: number) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-card border border-border text-center"
                    >
                      <span className="font-heading text-3xl font-bold text-primary">
                        {achievement.number}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="animate-fade-up animation-delay-200">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                {settings.about_story_title}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{settings.about_story_paragraph_1}</p>
                <p>{settings.about_story_paragraph_2}</p>
                <p>{settings.about_story_paragraph_3}</p>
              </div>

              {/* Mission & Vision */}
              <div className="mt-10 space-y-6">
                <div className="p-6 rounded-xl bg-muted/50 border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">Mission</h3>
                  </div>
                  <p className="text-muted-foreground">{settings.about_mission}</p>
                </div>

                <div className="p-6 rounded-xl bg-muted/50 border-l-4 border-accent">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">Vision</h3>
                  </div>
                  <p className="text-muted-foreground">{settings.about_vision}</p>
                </div>
              </div>

              {/* Credentials */}
              {credentials.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Qualifications & Certifications
                  </h3>
                  <div className="space-y-3">
                    {credentials.map((credential: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{credential}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-10">
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Schedule a Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {settings.about_core_values_title}
            </h2>
            <p className="text-muted-foreground">
              {settings.about_core_values_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Client-Centered Care",
                description: "Your goals, preferences, and lifestyle are at the heart of every recommendation I make.",
              },
              {
                icon: BookOpen,
                title: "Evidence-Based Practice",
                description: "All strategies are grounded in the latest nutritional science and research.",
              },
              {
                icon: Target,
                title: "Sustainable Results",
                description: "Focus on long-term lifestyle changes rather than quick fixes that don't last.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-border text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-cta flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
