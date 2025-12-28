import { Check, Sparkles, Target, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const features = [
  {
    icon: Target,
    title: "Personalized Approach",
    description: "Every plan is tailored to your unique body, lifestyle, and goals.",
  },
  {
    icon: Sparkles,
    title: "Evidence-Based Methods",
    description: "Our strategies are backed by the latest nutritional science.",
  },
  {
    icon: Heart,
    title: "Ongoing Support",
    description: "Continuous guidance and adjustments throughout your journey.",
  },
];

const ValueProposition = () => {
  const [settings, setSettings] = useState({
    value_prop_title: 'Experience the Difference of Personalized Care',
    value_prop_description: 'Unlike one-size-fits-all diet plans, our approach considers your unique biochemistry, food preferences, cultural background, and lifestyle factors to create a sustainable path to optimal health.',
    value_prop_benefits: JSON.stringify([
      'Customized meal plans designed for your preferences',
      'Regular progress tracking and plan adjustments',
      'Access to exclusive recipes and resources',
      'Direct communication with Dr. Shah',
      'Sustainable lifestyle changes, not quick fixes',
      'Holistic approach considering all aspects of health'
    ]),
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        
        setSettings({
          value_prop_title: settingsMap.value_prop_title || settings.value_prop_title,
          value_prop_description: settingsMap.value_prop_description || settings.value_prop_description,
          value_prop_benefits: settingsMap.value_prop_benefits || settings.value_prop_benefits,
        });
      } catch (error) {
        console.error('Error loading value proposition settings:', error);
      }
    };
    loadSettings();
  }, []);

  const benefits = JSON.parse(settings.value_prop_benefits || '[]');

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              {settings.value_prop_title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {settings.value_prop_description}
            </p>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground/90">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6 animate-fade-up animation-delay-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-cta flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
