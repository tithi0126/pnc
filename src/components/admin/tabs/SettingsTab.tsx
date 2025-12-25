import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { settingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
      
      const settingsMap: any = {};
      if (Array.isArray(allSettings)) {
        allSettings.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value || '';
        });
      } else if (typeof allSettings === 'object') {
        Object.assign(settingsMap, allSettings);
      }

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

      {/* Account Info */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">User ID</label>
            <input
              type="text"
              value={user?.id || ""}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Basic Website Settings */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">Basic Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.phone_number}
              onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
            <input
              type="tel"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Working Hours</label>
            <input
              type="text"
              value={settings.working_hours}
              onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Badge Text</label>
            <input
              type="text"
              value={settings.hero_badge}
              onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title Highlight Text (will be styled differently)</label>
            <input
              type="text"
              value={settings.hero_title_highlight}
              onChange={(e) => setSettings({ ...settings, hero_title_highlight: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Clients Count</label>
              <input
                type="text"
                value={settings.stat_clients}
                onChange={(e) => setSettings({ ...settings, stat_clients: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years Experience</label>
              <input
                type="text"
                value={settings.stat_experience}
                onChange={(e) => setSettings({ ...settings, stat_experience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Success Rate</label>
              <input
                type="text"
                value={settings.stat_success}
                onChange={(e) => setSettings({ ...settings, stat_success: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">About Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={settings.about_title}
              onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (First Paragraph)</label>
            <textarea
              value={settings.about_description_1}
              onChange={(e) => setSettings({ ...settings, about_description_1: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description (Second Paragraph)</label>
            <textarea
              value={settings.about_description_2}
              onChange={(e) => setSettings({ ...settings, about_description_2: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Credentials (one per line)</label>
            <textarea
              value={JSON.parse(settings.about_credentials || '[]').join('\n')}
              onChange={(e) => {
                const credentials = e.target.value.split('\n').filter(c => c.trim());
                setSettings({ ...settings, about_credentials: JSON.stringify(credentials) });
              }}
              rows={4}
              placeholder="Ph.D. in Nutrition Science&#10;Certified Dietitian&#10;Sports Nutrition Expert&#10;Published Author"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">Value Proposition Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={settings.value_prop_title}
              onChange={(e) => setSettings({ ...settings, value_prop_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={settings.value_prop_description}
              onChange={(e) => setSettings({ ...settings, value_prop_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
            <textarea
              value={JSON.parse(settings.value_prop_benefits || '[]').join('\n')}
              onChange={(e) => {
                const benefits = e.target.value.split('\n').filter(b => b.trim());
                setSettings({ ...settings, value_prop_benefits: JSON.stringify(benefits) });
              }}
              rows={6}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">Call-to-Action Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={settings.cta_title}
              onChange={(e) => setSettings({ ...settings, cta_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={settings.cta_description}
              onChange={(e) => setSettings({ ...settings, cta_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* About Page Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-medium text-foreground mb-4">About Page</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Page Title</label>
            <input
              type="text"
              value={settings.about_page_title}
              onChange={(e) => setSettings({ ...settings, about_page_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Page Subtitle</label>
            <textarea
              value={settings.about_page_subtitle}
              onChange={(e) => setSettings({ ...settings, about_page_subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Story Title</label>
            <input
              type="text"
              value={settings.about_story_title}
              onChange={(e) => setSettings({ ...settings, about_story_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Story Paragraph 1</label>
            <textarea
              value={settings.about_story_paragraph_1}
              onChange={(e) => setSettings({ ...settings, about_story_paragraph_1: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Story Paragraph 2</label>
            <textarea
              value={settings.about_story_paragraph_2}
              onChange={(e) => setSettings({ ...settings, about_story_paragraph_2: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Story Paragraph 3</label>
            <textarea
              value={settings.about_story_paragraph_3}
              onChange={(e) => setSettings({ ...settings, about_story_paragraph_3: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mission Statement</label>
            <textarea
              value={settings.about_mission}
              onChange={(e) => setSettings({ ...settings, about_mission: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Vision Statement</label>
            <textarea
              value={settings.about_vision}
              onChange={(e) => setSettings({ ...settings, about_vision: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Qualifications (one per line)</label>
            <textarea
              value={JSON.parse(settings.about_page_credentials || '[]').join('\n')}
              onChange={(e) => {
                const credentials = e.target.value.split('\n').filter(c => c.trim());
                setSettings({ ...settings, about_page_credentials: JSON.stringify(credentials) });
              }}
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Achievements (format: number|label, one per line)</label>
            <textarea
              value={JSON.parse(settings.about_page_achievements || '[]').map((a: any) => `${a.number}|${a.label}`).join('\n')}
              onChange={(e) => {
                const achievements = e.target.value.split('\n').filter(a => a.trim()).map(line => {
                  const [number, label] = line.split('|');
                  return { number: number?.trim() || '', label: label?.trim() || '' };
                });
                setSettings({ ...settings, about_page_achievements: JSON.stringify(achievements) });
              }}
              rows={4}
              placeholder="5000+|Clients Helped&#10;15+|Years Experience"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Core Values Title</label>
            <input
              type="text"
              value={settings.about_core_values_title}
              onChange={(e) => setSettings({ ...settings, about_core_values_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Core Values Subtitle</label>
            <textarea
              value={settings.about_core_values_subtitle}
              onChange={(e) => setSettings({ ...settings, about_core_values_subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>

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
