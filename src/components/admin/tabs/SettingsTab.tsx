import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  BasicSettingsSection,
  HeroSettingsSection,
  AboutPreviewSettingsSection,
  ServicesPreviewSettingsSection,
  TestimonialsPreviewSettingsSection,
  ValuePropositionSettingsSection,
  CTASettingsSection,
  NavbarSettingsSection,
  FooterSettingsSection,
  AboutPageSettingsSection,
  ServicesPageSettingsSection,
  ContactPageSettingsSection,
  TestimonialsPageSettingsSection,
  GalleryPageSettingsSection,
} from "./settings";

export const SettingsTab = () => {
  const { user } = useAuth();
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
    stat_clients: '5000+',
    stat_experience: '15+',
    stat_success: '98%',

    // About Preview Section
    about_title: 'Passionate About Transforming Lives Through Nutrition',
    about_description_1: 'With over 15 years of experience in clinical nutrition and wellness consulting, Dr. Bidita Shah has helped thousands of individuals achieve their health goals through personalized nutrition strategies and sustainable lifestyle changes.',
    about_description_2: 'Her holistic approach combines cutting-edge nutritional science with practical, real-world solutions that fit seamlessly into your daily life. Whether you\'re looking to manage weight, improve athletic performance, or address specific health concerns, Dr. Shah provides the guidance and support you need.',
    about_credentials: JSON.stringify(['Ph.D. in Nutrition Science', 'Certified Dietitian', 'Sports Nutrition Expert', 'Published Author']),

    // Services Preview Section
    services_title: 'Comprehensive Nutrition Services',
    services_subtitle: 'Tailored solutions for your unique health and wellness goals',
    services_features: JSON.stringify([
      { title: 'Personalized Nutrition Plans', description: 'Custom meal plans designed specifically for your dietary needs and preferences.' },
      { title: 'Weight Management', description: 'Evidence-based approaches for sustainable weight loss or gain.' },
      { title: 'Diabetes Care', description: 'Specialized nutrition counseling for diabetes management and blood sugar control.' },
      { title: 'Sports Nutrition', description: 'Performance-enhancing nutrition plans for athletes and active individuals.' }
    ]),

    // Testimonials Preview Section
    testimonials_title: 'What Our Clients Say',
    testimonials_subtitle: 'Real experiences from real people who transformed their health',

    // Value Proposition Section
    value_prop_title: 'Why Choose Personalized Nutrition?',
    value_prop_description: 'Every individual is unique, and so should be their nutrition plan. Our evidence-based approach ensures sustainable results.',
    value_prop_benefits: JSON.stringify([
      'Comprehensive health assessment',
      'Customized meal planning',
      'Regular progress monitoring',
      'Ongoing support and guidance',
      'Evidence-based nutrition science',
      'Sustainable lifestyle changes'
    ]),

    // CTA Section
    cta_title: 'Ready to Transform Your Health?',
    cta_description: 'Take the first step towards optimal health with personalized nutrition guidance.',

    // Navbar Settings
    navbar_brand_name: 'Dr. Bidita Shah',
    navbar_brand_tagline: 'Nutrition Consultant',

    // Footer Settings
    footer_description: 'Transforming lives through personalized nutrition guidance and holistic wellness approaches.',
    footer_services: JSON.stringify([
      'Nutrition Consultation',
      'Diet Plans',
      'Weight Management',
      'Sports Nutrition',
      'Corporate Wellness'
    ]),
    footer_copyright: '© {year} Dr. Bidita Shah. All rights reserved.',
    footer_links: JSON.stringify([
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Admin', path: '/admin/auth' }
    ]),
    social_links: JSON.stringify([
      { platform: 'Facebook', url: 'https://facebook.com/drbiditashah', icon: 'Facebook' },
      { platform: 'Instagram', url: 'https://instagram.com/drbiditashah', icon: 'Instagram' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/drbiditashah', icon: 'Linkedin' }
    ]),

    // About Page
    about_page_title: 'About Dr. Bidita Shah',
    about_page_subtitle: 'Leading Clinical Nutritionist & Dietitian in Mumbai',
    about_story_title: 'My Journey in Nutrition',
    about_story_paragraph_1: 'My passion for nutrition began during my academic journey...',
    about_story_paragraph_2: 'Over the past 15 years, I have had the privilege of working with over 5,000 clients...',
    about_story_paragraph_3: 'As a food entrepreneur and consultant...',
    about_mission: 'To empower individuals with knowledge and personalized nutrition strategies.',
    about_vision: 'A world where everyone has access to expert nutrition guidance.',
    about_page_credentials: JSON.stringify(['Ph.D. in Clinical Nutrition', 'Certified Diabetes Educator']),
    about_page_achievements: JSON.stringify([{ number: '5000+', label: 'Happy Clients' }]),
    about_core_values_title: 'Core Values',
    about_core_values_subtitle: 'The principles that guide every consultation.',

    // Services Page
    services_page_title: 'Our Nutrition Services',
    services_page_subtitle: 'Comprehensive nutrition solutions for optimal health',
    services_page_intro: 'We offer a wide range of personalized nutrition services...',

    // Contact Page
    contact_page_title: 'Get In Touch',
    contact_page_subtitle: 'Ready to start your nutrition journey?',
    contact_page_description: 'Contact us today for personalized nutrition consultation.',

    // Testimonials Page
    testimonials_page_title: 'Client Success Stories',
    testimonials_page_subtitle: 'Real transformations, real results',

    // Gallery Page
    gallery_page_title: 'Our Gallery',
    gallery_page_subtitle: 'Explore our nutrition and wellness journey',
  });

  useEffect(() => {
    // Load settings asynchronously
    loadSettings();
  }, []);

  // Force load defaults after 3 seconds to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Forcing settings to load with defaults due to timeout');
        setIsLoading(false);
        toast({
          title: "Settings loaded",
          description: "Using default settings. API may not be available.",
        });
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const loadSettings = async () => {
    try {
      console.log('Loading settings...');
      const allSettings = await settingsAPI.getAll();
      console.log('Settings loaded:', allSettings);

      // If we get here, API worked, so set loading to false
      setIsLoading(false);

      const settingsMap: any = allSettings || {};

      const getSetting = (key: string, defaultValue: string) => {
        const value = settingsMap[key];
        return value !== undefined ? value : defaultValue;
      };

      setSettings({
        site_name: getSetting('site_name', 'Dr. Bidita Shah - Nutrition Consultant'),
        contact_email: getSetting('contact_email', 'drbiditashah@gmail.com'),
        whatsapp_number: getSetting('whatsapp_number', '+91 9876543210'),
        phone_number: getSetting('phone_number', '+91 9876543210'),
        address: getSetting('address', 'Mumbai, Maharashtra, India'),
        working_hours: getSetting('working_hours', 'Mon - Sat: 10:00 AM - 7:00 PM'),
        hero_badge: getSetting('hero_badge', 'Leading Nutrition Consultant'),
        hero_title: getSetting('hero_title', 'Transform Your Health Journey with Dr. Bidita Shah'),
        hero_title_highlight: getSetting('hero_title_highlight', 'Dr. Bidita Shah'),
        hero_subtitle: getSetting('hero_subtitle', 'Expert nutrition guidance for weight management, diabetes care, sports nutrition, and holistic wellness. Personalized plans backed by 15+ years of clinical experience and scientific expertise.'),
        stat_clients: getSetting('stat_clients', '5000+'),
        stat_experience: getSetting('stat_experience', '15+'),
        stat_success: getSetting('stat_success', '98%'),
        about_title: getSetting('about_title', 'Meet Dr. Bidita Shah - Your Nutrition Expert'),
        about_description_1: getSetting('about_description_1', 'Dr. Bidita Shah is a renowned Clinical Nutritionist and Dietitian with over 15 years of experience in the field of nutrition and wellness. She specializes in personalized nutrition counseling, weight management, diabetes care, and sports nutrition.'),
        about_description_2: getSetting('about_description_2', 'As a certified dietitian and nutrition consultant, Dr. Shah combines her extensive clinical experience with the latest scientific research to create customized nutrition plans that deliver real, sustainable results.'),
        about_credentials: getSetting('about_credentials', JSON.stringify([
          'Ph.D. in Clinical Nutrition',
          'M.Sc. in Dietetics & Food Service Management',
          'Certified Diabetes Educator (CDE)',
          'Sports Nutrition Specialist',
          'Member - Indian Dietetic Association'
        ])),
        services_title: getSetting('services_title', 'Comprehensive Nutrition Services'),
        services_subtitle: getSetting('services_subtitle', 'Tailored solutions for your unique health and wellness goals'),
        services_features: getSetting('services_features', JSON.stringify([
          { title: 'Personalized Nutrition Plans', description: 'Custom meal plans designed specifically for your dietary needs and preferences.' },
          { title: 'Weight Management', description: 'Evidence-based approaches for sustainable weight loss or gain.' },
          { title: 'Diabetes Care', description: 'Specialized nutrition counseling for diabetes management and blood sugar control.' },
          { title: 'Sports Nutrition', description: 'Performance-enhancing nutrition plans for athletes and active individuals.' }
        ])),
        testimonials_title: getSetting('testimonials_title', 'What Our Clients Say'),
        testimonials_subtitle: getSetting('testimonials_subtitle', 'Real experiences from real people who transformed their health'),
        value_prop_title: getSetting('value_prop_title', 'Why Choose Personalized Nutrition Consulting?'),
        value_prop_description: getSetting('value_prop_description', 'Every individual is unique, and so should be their nutrition plan. Our evidence-based, personalized approach ensures you get the right nutrients for your specific health goals and lifestyle.'),
        value_prop_benefits: getSetting('value_prop_benefits', JSON.stringify([
          'Comprehensive health assessment and health evaluation',
          'Customized meal plans based on your food preferences and cultural background',
          'Regular monitoring and plan adjustments for optimal results',
          'Education on nutrition science and healthy eating habits',
          'Focus on sustainable lifestyle changes, not quick fixes',
          'Holistic approach addressing physical and mental well-being'
        ])),
        cta_title: getSetting('cta_title', 'Ready to Transform Your Health?'),
        cta_description: getSetting('cta_description', 'Take the first step towards a healthier, more vibrant you. Book a consultation today and discover how personalized nutrition can change your life.'),
        navbar_brand_name: getSetting('navbar_brand_name', 'Dr. Bidita Shah'),
        navbar_brand_tagline: getSetting('navbar_brand_tagline', 'Nutrition Consultant'),
        footer_description: getSetting('footer_description', 'Transforming lives through personalized nutrition guidance and holistic wellness approaches. Expert clinical nutritionist with 15+ years of experience in Mumbai.'),
        footer_services: getSetting('footer_services', JSON.stringify([
          'Nutrition Consultation',
          'Diet Plans',
          'Weight Management',
          'Sports Nutrition',
          'Diabetes Care',
          'Thyroid Management'
        ])),
        footer_copyright: getSetting('footer_copyright', '© {year} Dr. Bidita Shah. All rights reserved.'),
        footer_links: getSetting('footer_links', JSON.stringify([
          { name: 'Privacy Policy', path: '/privacy' },
          { name: 'Terms of Service', path: '/terms' },
          { name: 'Admin', path: '/admin/auth' }
        ])),
        social_links: getSetting('social_links', JSON.stringify([
          { platform: 'Facebook', url: 'https://facebook.com/drbiditashah', icon: 'Facebook' },
          { platform: 'Instagram', url: 'https://instagram.com/drbiditashah', icon: 'Instagram' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/drbiditashah', icon: 'Linkedin' }
        ])),
        about_page_title: getSetting('about_page_title', 'About Dr. Bidita Shah'),
        about_page_subtitle: getSetting('about_page_subtitle', 'Leading Clinical Nutritionist & Dietitian in Mumbai, dedicated to transforming lives through evidence-based nutrition.'),
        about_story_title: getSetting('about_story_title', 'My Journey in Nutrition'),
        about_story_paragraph_1: getSetting('about_story_paragraph_1', 'My passion for nutrition began during my academic journey, where I pursued advanced degrees in Clinical Nutrition and Dietetics. Witnessing the transformative power of proper nutrition firsthand inspired me to dedicate my career to helping others achieve optimal health.'),
        about_story_paragraph_2: getSetting('about_story_paragraph_2', 'Over the past 15 years, I have had the privilege of working with over 5,000 clients, from professional athletes seeking peak performance to individuals managing chronic conditions like diabetes, thyroid disorders, and metabolic syndrome. Each success story reinforces my commitment to personalized, evidence-based nutrition counseling.'),
        about_story_paragraph_3: getSetting('about_story_paragraph_3', 'As a food entrepreneur and consultant, I have also collaborated with restaurants, gyms, and corporate wellness programs, helping them create nutritious, delicious offerings that promote health and well-being. This diverse experience has given me a unique perspective on how nutrition intersects with lifestyle, culture, and business.'),
        about_mission: getSetting('about_mission', 'To empower individuals with the knowledge, tools, and personalized nutrition strategies they need to achieve lasting health transformation and optimal well-being.'),
        about_vision: getSetting('about_vision', 'A world where everyone has access to expert, personalized nutrition guidance that enables them to live healthier, more vibrant lives free from diet-related health challenges.'),
        about_page_credentials: getSetting('about_page_credentials', JSON.stringify([
          'Ph.D. in Clinical Nutrition - University of Mumbai',
          'M.Sc. in Dietetics & Food Service Management - SNDT University',
          'Certified Diabetes Educator (CDE) - Indian Association of Diabetes Educators',
          'Sports Nutrition Specialist - International Society of Sports Nutrition',
          'Certified Nutrition Support Clinician',
          'Member - Indian Dietetic Association',
          'Member - Nutrition Society of India'
        ])),
        about_page_achievements: getSetting('about_page_achievements', JSON.stringify([
          { number: '5000+', label: 'Happy Clients' },
          { number: '15+', label: 'Years Experience' },
          { number: '98%', label: 'Success Rate' },
          { number: '50+', label: 'Corporate Partnerships' }
        ])),
        about_core_values_title: getSetting('about_core_values_title', 'Core Values'),
        about_core_values_subtitle: getSetting('about_core_values_subtitle', 'The principles that guide every consultation and every recommendation I make.'),
        services_page_title: getSetting('services_page_title', 'Our Nutrition Services'),
        services_page_subtitle: getSetting('services_page_subtitle', 'Comprehensive nutrition solutions for optimal health'),
        services_page_intro: getSetting('services_page_intro', 'We offer a wide range of personalized nutrition services...'),
        contact_page_title: getSetting('contact_page_title', 'Get In Touch'),
        contact_page_subtitle: getSetting('contact_page_subtitle', 'Ready to start your nutrition journey?'),
        contact_page_description: getSetting('contact_page_description', 'Contact us today for personalized nutrition consultation.'),
        testimonials_page_title: getSetting('testimonials_page_title', 'Client Success Stories'),
        testimonials_page_subtitle: getSetting('testimonials_page_subtitle', 'Real transformations, real results'),
        gallery_page_title: getSetting('gallery_page_title', 'Our Gallery'),
        gallery_page_subtitle: getSetting('gallery_page_subtitle', 'Explore our nutrition and wellness journey'),
      });

      console.log('Settings loaded successfully');
    } catch (error: any) {
      console.error('Error loading settings:', error);
      // Don't show error toast - let timeout handle showing defaults
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

      {/* Website Basics */}
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

      <NavbarSettingsSection
        settings={{
          navbar_brand_name: settings.navbar_brand_name,
          navbar_brand_tagline: settings.navbar_brand_tagline,
        }}
        onChange={handleSettingChange}
      />

      {/* Homepage Sections */}
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

      <AboutPreviewSettingsSection
        settings={{
          about_title: settings.about_title,
          about_description_1: settings.about_description_1,
          about_description_2: settings.about_description_2,
          about_credentials: settings.about_credentials,
        }}
        onChange={handleSettingChange}
      />

      <ServicesPreviewSettingsSection
        settings={{
          services_title: settings.services_title,
          services_subtitle: settings.services_subtitle,
          services_features: settings.services_features,
        }}
        onChange={handleSettingChange}
      />

      <TestimonialsPreviewSettingsSection
        settings={{
          testimonials_title: settings.testimonials_title,
          testimonials_subtitle: settings.testimonials_subtitle,
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

      <CTASettingsSection
        settings={{
          cta_title: settings.cta_title,
          cta_description: settings.cta_description,
        }}
        onChange={handleSettingChange}
      />

      <FooterSettingsSection
        settings={{
          footer_description: settings.footer_description,
          footer_services: settings.footer_services,
          footer_copyright: settings.footer_copyright,
          footer_links: settings.footer_links,
          social_links: settings.social_links,
        }}
        onChange={handleSettingChange}
      />

      {/* Individual Pages */}
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

      <ServicesPageSettingsSection
        settings={{
          services_page_title: settings.services_page_title,
          services_page_subtitle: settings.services_page_subtitle,
          services_page_intro: settings.services_page_intro,
        }}
        onChange={handleSettingChange}
      />

      <ContactPageSettingsSection
        settings={{
          contact_page_title: settings.contact_page_title,
          contact_page_subtitle: settings.contact_page_subtitle,
          contact_page_description: settings.contact_page_description,
        }}
        onChange={handleSettingChange}
      />

      <TestimonialsPageSettingsSection
        settings={{
          testimonials_page_title: settings.testimonials_page_title,
          testimonials_page_subtitle: settings.testimonials_page_subtitle,
        }}
        onChange={handleSettingChange}
      />

      <GalleryPageSettingsSection
        settings={{
          gallery_page_title: settings.gallery_page_title,
          gallery_page_subtitle: settings.gallery_page_subtitle,
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
