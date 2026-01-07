import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsAPI } from "@/lib/api";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Awards", path: "/awards" },
  { name: "Gallery", path: "/gallery" },
  { name: "Products", path: "/products" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [navbarBrandName, setNavbarBrandName] = useState('Dr. Bidita Shah');
  const [navbarBrandTagline, setNavbarBrandTagline] = useState('Nutrition Consultant');
  const [logoUrl, setLogoUrl] = useState('/pnc-logo.svg');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};

        if (settingsMap.phone_number) {
          setPhoneNumber(settingsMap.phone_number);
        }
        if (settingsMap.navbar_brand_name) {
          setNavbarBrandName(settingsMap.navbar_brand_name);
        }
        if (settingsMap.navbar_brand_tagline) {
          setNavbarBrandTagline(settingsMap.navbar_brand_tagline);
        }
        if (settingsMap.logo_url) {
          setLogoUrl(settingsMap.logo_url);
        }
      } catch (error) {
        console.error('Error loading navbar settings:', error);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-lg border-b border-border",
        isScrolled
          ? "py-3"
          : "py-5"
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={logoUrl}
                alt="PNC Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center flex-shrink-0';
                  fallback.innerHTML = '<span class="font-heading text-xl text-primary-foreground font-bold">PNC</span>';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="font-heading text-xl font-semibold text-foreground truncate block">
                {navbarBrandName}
              </span>
              <p className="text-xs text-muted-foreground -mt-1 truncate">{navbarBrandTagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation - Center, takes available space */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center justify-between w-full max-w-3xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors px-2 py-1 flex-shrink-0",
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button - Right Side */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate max-w-[120px]">{phoneNumber}</span>
            </a>
            <Link to="/contact" className="btn-primary text-sm whitespace-nowrap">
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="grid grid-cols-2 gap-2 py-4 border-t border-border bg-background rounded-lg shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="col-span-2 flex flex-col gap-3 mt-2 pt-4 border-t border-border">
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {/* <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span> */}
              </a>
              <Link
                to="/contact"
                className="btn-primary text-sm text-center"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
