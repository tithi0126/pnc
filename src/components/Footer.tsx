import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { settingsAPI } from "@/lib/api";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contactSettings, setContactSettings] = useState({
    contact_email: 'info@drbiditashah.com',
    phone_number: '+1 234 567 890',
    address: '123 Wellness Center, Health Street, Mumbai 400001',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        
        setContactSettings({
          contact_email: settingsMap.contact_email || contactSettings.contact_email,
          phone_number: settingsMap.phone_number || contactSettings.phone_number,
          address: settingsMap.address || contactSettings.address,
        });
      } catch (error) {
        console.error('Error loading footer settings:', error);
      }
    };
    loadSettings();
  }, []);

  const phoneLink = `tel:${contactSettings.phone_number.replace(/\s/g, '')}`;
  const emailLink = `mailto:${contactSettings.contact_email}`;

  return (
    <footer className="bg-forest text-cream">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-heading text-xl text-primary-foreground font-bold">B</span>
              </div>
              <span className="font-heading text-xl font-semibold">Dr. Bidita Shah</span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Transforming lives through personalized nutrition guidance and holistic wellness approaches.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
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
              {[
                "Nutrition Consultation",
                "Diet Plans",
                "Weight Management",
                "Sports Nutrition",
                "Corporate Wellness",
                "Food Entrepreneurship",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-cream/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
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
              © {currentYear} Dr. Bidita Shah. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-cream/60 hover:text-cream text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-cream/60 hover:text-cream text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/admin/auth" className="text-cream/60 hover:text-cream text-sm transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
