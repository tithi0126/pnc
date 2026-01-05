import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactSettings, setContactSettings] = useState({
    contact_email: 'drbiditashah@gmail.com',
    phone_number: '+91 9876543210',
    address: 'C/o Priyam Clinic, Shop No 18, Mahalaxmi Arcade, Near Mahalaxmi Temple, Opposite Sagar Complex, Adajan Dn, Surat-395009, Gujarat',
  });

  const [logoUrl, setLogoUrl] = useState('/pnc-logo.svg');

  const [footerSettings, setFooterSettings] = useState({
    footer_description: 'Transforming lives through personalized nutrition guidance and holistic wellness approaches. Expert clinical nutritionist with 15+ years of experience in Surat.',
    footer_services: JSON.stringify([
      'Nutrition Consultation',
      'Diet Plans',
      'Weight Management',
      'Sports Nutrition',
      'Diabetes Care',
      'Thyroid Management'
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
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};

        setContactSettings({
          contact_email: settingsMap.contact_email || contactSettings.contact_email,
          phone_number: settingsMap.phone_number || contactSettings.phone_number,
          address: settingsMap.address || 'C/o Priyam Clinic, Shop No 18, Mahalaxmi Arcade, Near Mahalaxmi Temple, Opposite Sagar Complex, Adajan Dn, Surat-395009, Gujarat',
        });

        setFooterSettings({
          footer_description: settingsMap.footer_description || footerSettings.footer_description,
          footer_services: settingsMap.footer_services || footerSettings.footer_services,
          footer_copyright: settingsMap.footer_copyright || footerSettings.footer_copyright,
          footer_links: settingsMap.footer_links || footerSettings.footer_links,
          social_links: settingsMap.social_links || footerSettings.social_links,
        });

        if (settingsMap.logo_url) {
          setLogoUrl(settingsMap.logo_url);
        }
      } catch (error) {
        console.error('Error loading footer settings:', error);
      }
    };
    loadSettings();
  }, []);

  const phoneLink = `tel:${contactSettings.phone_number.replace(/\s/g, '')}`;
  const emailLink = `mailto:${contactSettings.contact_email}`;

  const services = JSON.parse(footerSettings.footer_services || '[]');
  const footerLinks = JSON.parse(footerSettings.footer_links || '[]');
  const socialLinks = JSON.parse(footerSettings.social_links || '[]');
  const copyrightText = footerSettings.footer_copyright.replace('{year}', currentYear.toString());

  return (
    <footer className="bg-forest text-cream">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="PNC Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to default logo if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center';
                    fallback.innerHTML = '<span class="font-heading text-xl text-primary-foreground font-bold">PNC</span>';
                    target.parentElement?.appendChild(fallback);
                  }}
                />
              </div>
              <span className="font-heading text-xl font-semibold">Dr. Bidita Shah</span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              {footerSettings.footer_description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social: any) => {
                const IconComponent = social.icon === 'Facebook' ? Facebook :
                                    social.icon === 'Instagram' ? Instagram :
                                    social.icon === 'Twitter' ? Twitter :
                                    social.icon === 'Linkedin' ? Linkedin : Facebook;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.platform}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Gallery", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-cream/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service: string) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-cream/70 hover:text-primary transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">
                  {contactSettings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={phoneLink}
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  {contactSettings.phone_number}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={emailLink}
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  {contactSettings.contact_email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cream/60 text-sm">
              {copyrightText}
            </p>
            <div className="flex gap-6">
              {footerLinks.map((link: any) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-cream/60 hover:text-cream text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
