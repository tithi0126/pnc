// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X, Phone } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { settingsAPI } from "@/lib/api";

// const navLinks = [
//   { name: "Home", path: "/" },
//   { name: "About", path: "/about" },
//   { name: "Services", path: "/services" },
//   { name: "Awards & Events", path: "/awards" },
//   { name: "Gallery", path: "/gallery" },
//   { name: "Testimonials", path: "/testimonials" },
//   { name: "Contact", path: "/contact" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();
//   const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
//   const [navbarBrandName, setNavbarBrandName] = useState('Dr. Bidita Shah');
//   const [navbarBrandTagline, setNavbarBrandTagline] = useState('Nutrition Consultant');
//   const [logoUrl, setLogoUrl] = useState('/pnc-logo.png');

//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         const allSettings = await settingsAPI.getPublic();
//         const settingsMap: any = allSettings || {};

//         if (settingsMap.phone_number) {
//           setPhoneNumber(settingsMap.phone_number);
//         }
//         if (settingsMap.navbar_brand_name) {
//           setNavbarBrandName(settingsMap.navbar_brand_name);
//         }
//         if (settingsMap.navbar_brand_tagline) {
//           setNavbarBrandTagline(settingsMap.navbar_brand_tagline);
//         }
//         if (settingsMap.logo_url) {
//           setLogoUrl(settingsMap.logo_url);
//         }
//       } catch (error) {
//         console.error('Error loading navbar settings:', error);
//       }
//     };
//     loadSettings();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsOpen(false);
//   }, [location]);

//   return (
//     <header
//       className={cn(
//         "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
//         isScrolled
//           ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
//           : "bg-transparent py-5"
//       )}
//     >
//       <div className="container-custom">
//         <nav className="flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-10 h-10 flex items-center justify-center">
//               <img
//                 src={logoUrl}
//                 alt="PNC Logo"
//                 className="w-full h-full object-contain"
//                 onError={(e) => {
//                   // Fallback to default logo if image fails to load
//                   const target = e.target as HTMLImageElement;
//                   target.style.display = 'none';
//                   const fallback = document.createElement('div');
//                   fallback.className = 'w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center';
//                   fallback.innerHTML = '<span class="font-heading text-xl text-primary-foreground font-bold">PNC</span>';
//                   target.parentElement?.appendChild(fallback);
//                 }}
//               />
//             </div>
//             <div className="hidden sm:block">
//               <span className="font-heading text-xl font-semibold text-foreground">
//                 {navbarBrandName}
//               </span>
//               <p className="text-xs text-muted-foreground -mt-1">{navbarBrandTagline}</p>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={cn(
//                   "text-sm font-medium transition-colors link-underline",
//                   location.pathname === link.path
//                     ? "text-primary"
//                     : "text-foreground/80 hover:text-primary"
//                 )}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* CTA Button */}
//           <div className="hidden lg:flex items-center gap-4">
//             <a
//               href={`tel:${phoneNumber.replace(/\s/g, '')}`}
//               className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
//             >
//               <Phone className="w-4 h-4" />
//               <span>{phoneNumber}</span>
//             </a>
//             <Link to="/contact" className="btn-primary text-sm">
//               Book Consultation
//             </Link>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="lg:hidden p-2 text-foreground"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </nav>

//         {/* Mobile Navigation */}
//         <div
//           className={cn(
//             "lg:hidden overflow-hidden transition-all duration-300",
//             isOpen ? "max-h-96 mt-4" : "max-h-0"
//           )}
//         >
//           <div className="flex flex-col gap-2 py-4 border-t border-border bg-background rounded-lg shadow-lg">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={cn(
//                   "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
//                   location.pathname === link.path
//                     ? "bg-primary/10 text-primary"
//                     : "text-foreground/80 hover:bg-muted"
//                 )}
//               >
//                 {link.name}
//               </Link>
//             ))}
//             <Link
//               to="/contact"
//               className="btn-primary text-sm text-center mt-2"
//             >
//               Book Consultation
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsAPI } from "@/lib/api";

// Group related navigation items
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Awards & Events", path: "/awards" },
  { name: "Gallery", path: "/gallery" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

// Split into primary and secondary for better organization
const primaryNavLinks = navLinks.slice(0, 4); // Home, About, Services, Awards
const secondaryNavLinks = navLinks.slice(4); // Gallery, Testimonials, Contact

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('+91 9876543210');
  const [navbarBrandName, setNavbarBrandName] = useState('Dr. Bidita Shah');
  const [navbarBrandTagline, setNavbarBrandTagline] = useState('Nutrition Consultant');
  const [logoUrl, setLogoUrl] = useState('/pnc-logo.png');

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="PNC Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center';
                  fallback.innerHTML = '<span class="font-heading text-xl text-primary-foreground font-bold">PNC</span>';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-semibold text-foreground">
                {navbarBrandName}
              </span>
              <p className="text-xs text-muted-foreground -mt-1">{navbarBrandTagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Primary Navigation */}
            {primaryNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-1",
                  location.pathname === link.path
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/80"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* More Dropdown for Secondary Items */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary px-1 transition-colors">
                More
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50",
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{phoneNumber}</span>
            </a>
            <Link to="/contact" className="btn-primary text-sm">
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] mt-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 py-4 border-t border-border bg-background rounded-lg shadow-lg">
            {/* Primary Mobile Links */}
            {primaryNavLinks.map((link) => (
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
            
            {/* Secondary Mobile Links - Collapsible */}
            <div className="mt-1">
              <button
                onClick={() => setShowMore(!showMore)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted flex items-center justify-between transition-colors"
              >
                More
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showMore && "rotate-180"
                )} />
              </button>
              <div className={cn(
                "overflow-hidden transition-all duration-300",
                showMore ? "max-h-60" : "max-h-0"
              )}>
                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "block px-8 py-3 text-sm font-medium transition-colors",
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:bg-muted/50"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Contact Info */}
            <div className="px-4 py-3 mt-2">
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors mb-3"
              >
                <Phone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
              <Link
                to="/contact"
                className="btn-primary text-sm text-center w-full block"
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
