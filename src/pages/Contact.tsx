import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactAPI, settingsAPI } from "@/lib/api";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    contact_email: 'info@drbiditashah.com',
    phone_number: '+1 234 567 890',
    address: '123 Wellness Center, Health Street, Mumbai 400001',
    working_hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    whatsapp_number: '+91 98765 43210',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        
        setContactSettings({
          contact_email: settingsMap.contact_email || 'info@drbiditashah.com',
          phone_number: settingsMap.phone_number || '+1 234 567 890',
          address: settingsMap.address || '123 Wellness Center, Health Street, Mumbai 400001',
          working_hours: settingsMap.working_hours || 'Mon - Sat: 9:00 AM - 6:00 PM',
          whatsapp_number: settingsMap.whatsapp_number || '+91 98765 43210',
        });
      } catch (error) {
        console.error('Error loading contact settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message,
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneLink = `tel:${contactSettings.phone_number.replace(/\s/g, '')}`;
  const emailLink = `mailto:${contactSettings.contact_email}`;
  
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: contactSettings.phone_number,
      link: phoneLink,
    },
    {
      icon: Mail,
      title: "Email",
      content: contactSettings.contact_email,
      link: emailLink,
    },
    {
      icon: MapPin,
      title: "Address",
      content: contactSettings.address,
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: contactSettings.working_hours,
      link: null,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Contact Us</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Let's Start Your Health Journey
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have questions or ready to book a consultation? Reach out to us and we'll be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="animate-fade-up">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="nutrition-consultation">Nutrition Consultation</option>
                      <option value="weight-management">Weight Management</option>
                      <option value="sports-nutrition">Sports Nutrition</option>
                      <option value="prenatal-nutrition">Prenatal Nutrition</option>
                      <option value="corporate-wellness">Corporate Wellness</option>
                      <option value="food-consulting">Food Entrepreneurship</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your health goals or ask any questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info & Map */}
            <div className="animate-fade-up animation-delay-200">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>

              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        target={info.link.startsWith("http") ? "_blank" : undefined}
                        rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{info.content}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${contactSettings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#25D366] text-primary-foreground font-medium hover:bg-[#20BD5A] transition-colors mb-8 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.9025666891745!2d72.82476721490238!3d19.01744988712638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce6e65b32c71%3A0x2a5de3f8b8b0e!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
