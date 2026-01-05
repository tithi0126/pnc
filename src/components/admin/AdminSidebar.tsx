import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, FileText, MessageSquare, Trophy, Image, Mail,
  LogOut, Users, Settings, ChevronLeft, ChevronRight
} from "lucide-react";
import { settingsAPI } from "@/lib/api";

type TabType = "overview" | "services" | "testimonials" | "awards" | "gallery" | "inquiries" | "settings";

interface AdminSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSignOut: () => void;
}

const menuItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "services", label: "Services", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "awards", label: "Awards & Events", icon: Trophy },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "inquiries", label: "Inquiries", icon: Mail },
  // { id: "users", label: "Users", icon: Users }, // Commented out user management
  { id: "settings", label: "Settings", icon: Settings },
];

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onSignOut,
}: AdminSidebarProps) => {
  const [logoUrl, setLogoUrl] = useState('/pnc-logo.svg');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        if (settingsMap.logo_url) {
          setLogoUrl(settingsMap.logo_url);
        }
      } catch (error) {
        console.error('Error loading logo settings:', error);
      }
    };
    loadSettings();
  }, []);
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 bg-card border-r border-border transform transition-all duration-300 ${
        sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={logoUrl}
                alt="PNC Logo"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center';
                  fallback.innerHTML = '<span class="font-heading text-lg text-primary-foreground font-bold">PNC</span>';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <span className="font-heading font-semibold text-foreground block truncate">Admin</span>
                <p className="text-xs text-muted-foreground truncate">Dr. Bidita Shah</p>
              </div>
            )}
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-primary text-primary-foreground rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                activeTab === item.id ? "" : "group-hover:scale-110 transition-transform"
              }`} />
              {sidebarOpen && (
                <span className="font-medium text-sm truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export type { TabType };
