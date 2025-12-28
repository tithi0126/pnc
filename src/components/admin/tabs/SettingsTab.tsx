import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AccountInfoSection } from "./settings/AccountInfoSection";
import { BasicSettingsSection } from "./settings/BasicSettingsSection";
import { HeroSettingsSection } from "./settings/HeroSettingsSection";
import { AboutSettingsSection } from "./settings/AboutSettingsSection";
import { ValuePropositionSettingsSection } from "./settings/ValuePropositionSettingsSection";
import { WhyChooseUsSettingsSection } from "./settings/WhyChooseUsSettingsSection";
import { CTASettingsSection } from "./settings/CTASettingsSection";
import { AboutPageSettingsSection } from "./settings/AboutPageSettingsSection";

export const SettingsTab = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Basic Settings
    site_name: 'Dr. Bidita Shah - Nutrition Consultant',
    contact_email: 'contact@drbiditashah.com',
    whatsapp_number: '+91 98765 43210',
    phone_number: '+1 234 567 890',
    address: '123 Wellness Center, Health Street, Mumbai 400001',
    working_hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    
    // Hero Section
    hero_badge: 'Nutrition & Wellness Expert',
    hero_title: 'Transform Your Health with Expert Nutrition Guidance',
    hero_title_highlight: 'Expert Nutrition',
    hero_subtitle: 'Personalized nutrition plans tailored to your unique needs. Achieve your wellness goals with science-backed strategies and compassionate support from Dr. Bidita Shah.',
    
    // Stats
    stat_clients: '5000+',
    stat_experience: '15+',
    stat_success: '98%',
    
    // About Section
    about_title: 'Passionate About Transforming Lives Through Nutrition',
    about_description_1: 'With over 15 years of experience in clinical nutrition and wellness consulting, Dr. Bidita Shah has helped thousands of individuals achieve their health goals through personalized nutrition strategies and sustainable lifestyle changes.',
    about_description_2: 'Her holistic approach combines cutting-edge nutritional science with practical, real-world solutions that fit seamlessly into your daily life. Whether you\'re looking to manage weight, improve athletic performance, or address specific health concerns, Dr. Shah provides the guidance and support you need.',
    about_credentials: JSON.stringify(['Ph.D. in Nutrition Science', 'Certified Dietitian', 'Sports Nutrition Expert', 'Published Author']),
    
    // Value Proposition
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

    // Why Choose Us
    why_choose_title: 'Why Choose Dr. Bidita Shah?',
    why_choose_subtitle: 'Discover what makes our nutrition consulting services the right choice for your health journey.',
    why_choose_features: JSON.stringify([
      { title: 'Expert Certification', description: 'Over 15 years of clinical nutrition experience with advanced certifications' },
      { title: 'Personalized Approach', description: 'Every plan is tailored to your unique needs, preferences, and lifestyle' },
      { title: 'Evidence-Based Methods', description: 'All recommendations backed by the latest nutritional science and research' },
      { title: 'Holistic Care', description: 'Comprehensive approach considering diet, lifestyle, and mental well-being' },
      { title: 'Ongoing Support', description: 'Continuous guidance and adjustments throughout your transformation journey' },
      { title: 'Proven Results', description: '98% client satisfaction rate with sustainable, long-lasting results' }
    ]),

    // CTA Section
    cta_title: 'Ready to Start Your Wellness Journey?',
    cta_description: 'Take the first step towards a healthier you. Book a consultation today and discover how personalized nutrition can transform your life.',
    
    // About Page
    about_page_title: 'Dedicated to Transforming Lives Through Nutrition',
    about_page_subtitle: 'A journey of passion, expertise, and commitment to helping individuals achieve optimal health.',
    about_story_title: 'My Story',
    about_story_paragraph_1: 'My journey into nutrition began with a personal health transformation that changed my life. After experiencing firsthand the power of proper nutrition, I dedicated my career to helping others discover the same transformative potential.',
    about_story_paragraph_2: 'With over 15 years of clinical experience, I\'ve had the privilege of working with thousands of individuals—from professional athletes seeking peak performance to families looking for healthier lifestyles. Each client\'s success story fuels my passion for this field.',
    about_story_paragraph_3: 'As a food entrepreneur, I\'ve also worked with numerous restaurants and food businesses, helping them create nutritious yet delicious offerings. My approach bridges the gap between scientific nutrition and culinary excellence.',
    about_mission: 'To empower individuals with the knowledge and tools they need to achieve lasting health through personalized nutrition strategies that work for their unique lives.',
    about_vision: 'A world where everyone has access to expert nutrition guidance and where healthy eating is both accessible and enjoyable for all.',
    about_page_credentials: JSON.stringify([
      'Ph.D. in Clinical Nutrition - University of Mumbai',
      'Certified Dietitian (RD) - Indian Dietetic Association',
      'Sports Nutrition Specialist - International Society of Sports Nutrition',
      'Certified Diabetes Educator',
      'Member - Indian Medical Association'
    ]),
    about_page_achievements: JSON.stringify([
      { number: '5000+', label: 'Clients Helped' },
      { number: '15+', label: 'Years Experience' },
      { number: '12', label: 'Awards Won' },
      { number: '50+', label: 'Corporate Partners' }
    ]),
    about_core_values_title: 'Core Values',
    about_core_values_subtitle: 'The principles that guide every consultation and recommendation.',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await settingsAPI.getAll();
      
      const settingsMap: any = allSettings || {};

      const getSetting = (key: string, defaultValue: string) => 
        settingsMap[key] || defaultValue;

      setSettings({
        site_name: getSetting('site_name', 'Dr. Bidita Shah - Nutrition Consultant'),
        contact_email: getSetting('contact_email', 'contact@drbiditashah.com'),
        whatsapp_number: getSetting('whatsapp_number', '+91 98765 43210'),
        phone_number: getSetting('phone_number', '+1 234 567 890'),
        address: getSetting('address', '123 Wellness Center, Health Street, Mumbai 400001'),
        working_hours: getSetting('working_hours', 'Mon - Sat: 9:00 AM - 6:00 PM'),
        hero_badge: getSetting('hero_badge', 'Nutrition & Wellness Expert'),
        hero_title: getSetting('hero_title', 'Transform Your Health with Expert Nutrition Guidance'),
        hero_title_highlight: getSetting('hero_title_highlight', 'Expert Nutrition'),
        hero_subtitle: getSetting('hero_subtitle', 'Personalized nutrition plans tailored to your unique needs. Achieve your wellness goals with science-backed strategies and compassionate support from Dr. Bidita Shah.'),
        stat_clients: getSetting('stat_clients', '5000+'),
        stat_experience: getSetting('stat_experience', '15+'),
        stat_success: getSetting('stat_success', '98%'),
        about_title: getSetting('about_title', 'Passionate About Transforming Lives Through Nutrition'),
        about_description_1: getSetting('about_description_1', 'With over 15 years of experience in clinical nutrition and wellness consulting, Dr. Bidita Shah has helped thousands of individuals achieve their health goals through personalized nutrition strategies and sustainable lifestyle changes.'),
        about_description_2: getSetting('about_description_2', 'Her holistic approach combines cutting-edge nutritional science with practical, real-world solutions that fit seamlessly into your daily life. Whether you\'re looking to manage weight, improve athletic performance, or address specific health concerns, Dr. Shah provides the guidance and support you need.'),
        about_credentials: getSetting('about_credentials', JSON.stringify(['Ph.D. in Nutrition Science', 'Certified Dietitian', 'Sports Nutrition Expert', 'Published Author'])),
        value_prop_title: getSetting('value_prop_title', 'Experience the Difference of Personalized Care'),
        value_prop_description: getSetting('value_prop_description', 'Unlike one-size-fits-all diet plans, our approach considers your unique biochemistry, food preferences, cultural background, and lifestyle factors to create a sustainable path to optimal health.'),
        value_prop_benefits: getSetting('value_prop_benefits', JSON.stringify([
          'Customized meal plans designed for your preferences',
          'Regular progress tracking and plan adjustments',
          'Access to exclusive recipes and resources',
          'Direct communication with Dr. Shah',
          'Sustainable lifestyle changes, not quick fixes',
          'Holistic approach considering all aspects of health'
        ])),
        why_choose_title: getSetting('why_choose_title', 'Why Choose Dr. Bidita Shah?'),
        why_choose_subtitle: getSetting('why_choose_subtitle', 'Discover what makes our nutrition consulting services the right choice for your health journey.'),
        why_choose_features: getSetting('why_choose_features', JSON.stringify([
          { title: 'Expert Certification', description: 'Over 15 years of clinical nutrition experience with advanced certifications' },
          { title: 'Personalized Approach', description: 'Every plan is tailored to your unique needs, preferences, and lifestyle' },
          { title: 'Evidence-Based Methods', description: 'All recommendations backed by the latest nutritional science and research' },
          { title: 'Holistic Care', description: 'Comprehensive approach considering diet, lifestyle, and mental well-being' },
          { title: 'Ongoing Support', description: 'Continuous guidance and adjustments throughout your transformation journey' },
          { title: 'Proven Results', description: '98% client satisfaction rate with sustainable, long-lasting results' }
        ])),
        cta_title: getSetting('cta_title', 'Ready to Start Your Wellness Journey?'),
        cta_description: getSetting('cta_description', 'Take the first step towards a healthier you. Book a consultation today and discover how personalized nutrition can transform your life.'),
        about_page_title: getSetting('about_page_title', 'Dedicated to Transforming Lives Through Nutrition'),
        about_page_subtitle: getSetting('about_page_subtitle', 'A journey of passion, expertise, and commitment to helping individuals achieve optimal health.'),
        about_story_title: getSetting('about_story_title', 'My Story'),
        about_story_paragraph_1: getSetting('about_story_paragraph_1', 'My journey into nutrition began with a personal health transformation that changed my life. After experiencing firsthand the power of proper nutrition, I dedicated my career to helping others discover the same transformative potential.'),
        about_story_paragraph_2: getSetting('about_story_paragraph_2', 'With over 15 years of clinical experience, I\'ve had the privilege of working with thousands of individuals—from professional athletes seeking peak performance to families looking for healthier lifestyles. Each client\'s success story fuels my passion for this field.'),
        about_story_paragraph_3: getSetting('about_story_paragraph_3', 'As a food entrepreneur, I\'ve also worked with numerous restaurants and food businesses, helping them create nutritious yet delicious offerings. My approach bridges the gap between scientific nutrition and culinary excellence.'),
        about_mission: getSetting('about_mission', 'To empower individuals with the knowledge and tools they need to achieve lasting health through personalized nutrition strategies that work for their unique lives.'),
        about_vision: getSetting('about_vision', 'A world where everyone has access to expert nutrition guidance and where healthy eating is both accessible and enjoyable for all.'),
        about_page_credentials: getSetting('about_page_credentials', JSON.stringify([
          'Ph.D. in Clinical Nutrition - University of Mumbai',
          'Certified Dietitian (RD) - Indian Dietetic Association',
          'Sports Nutrition Specialist - International Society of Sports Nutrition',
          'Certified Diabetes Educator',
          'Member - Indian Medical Association'
        ])),
        about_page_achievements: getSetting('about_page_achievements', JSON.stringify([
          { number: '5000+', label: 'Clients Helped' },
          { number: '15+', label: 'Years Experience' },
          { number: '12', label: 'Awards Won' },
          { number: '50+', label: 'Corporate Partners' }
        ])),
        about_core_values_title: getSetting('about_core_values_title', 'Core Values'),
        about_core_values_subtitle: getSetting('about_core_values_subtitle', 'The principles that guide every consultation and recommendation.'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading settings",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.update(settings);

      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage all website content and preferences</p>
      </div>

      <AccountInfoSection />

      <BasicSettingsSection 
        settings={{
          site_name: settings.site_name,
          contact_email: settings.contact_email,
          whatsapp_number: settings.whatsapp_number,
          phone_number: settings.phone_number,
          address: settings.address,
          working_hours: settings.working_hours,
        }}
        onChange={handleSettingChange}
      />

      <HeroSettingsSection 
        settings={{
          hero_badge: settings.hero_badge,
          hero_title: settings.hero_title,
          hero_title_highlight: settings.hero_title_highlight,
          hero_subtitle: settings.hero_subtitle,
          stat_clients: settings.stat_clients,
          stat_experience: settings.stat_experience,
          stat_success: settings.stat_success,
        }}
        onChange={handleSettingChange}
      />

      <AboutSettingsSection 
        settings={{
          about_title: settings.about_title,
          about_description_1: settings.about_description_1,
          about_description_2: settings.about_description_2,
          about_credentials: settings.about_credentials,
        }}
        onChange={handleSettingChange}
      />

      <ValuePropositionSettingsSection
        settings={{
          value_prop_title: settings.value_prop_title,
          value_prop_description: settings.value_prop_description,
          value_prop_benefits: settings.value_prop_benefits,
        }}
        onChange={handleSettingChange}
      />

      <WhyChooseUsSettingsSection
        settings={{
          why_choose_title: settings.why_choose_title,
          why_choose_subtitle: settings.why_choose_subtitle,
          why_choose_features: settings.why_choose_features,
        }}
        onChange={handleSettingChange}
      />

      <CTASettingsSection
        settings={{
          cta_title: settings.cta_title,
          cta_description: settings.cta_description,
        }}
        onChange={handleSettingChange}
      />

      <AboutPageSettingsSection 
        settings={{
          about_page_title: settings.about_page_title,
          about_page_subtitle: settings.about_page_subtitle,
          about_story_title: settings.about_story_title,
          about_story_paragraph_1: settings.about_story_paragraph_1,
          about_story_paragraph_2: settings.about_story_paragraph_2,
          about_story_paragraph_3: settings.about_story_paragraph_3,
          about_mission: settings.about_mission,
          about_vision: settings.about_vision,
          about_page_credentials: settings.about_page_credentials,
          about_page_achievements: settings.about_page_achievements,
          about_core_values_title: settings.about_core_values_title,
          about_core_values_subtitle: settings.about_core_values_subtitle,
        }}
        onChange={handleSettingChange}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20">
        <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These actions are irreversible. Please be careful.
        </p>
        <button className="px-4 py-2 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
          Clear All Data
        </button>
      </div>
    </div>
  );
};
