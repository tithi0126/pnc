import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight, Bell, Plus, Settings, LogOut, Eye, Edit, Trash2 } from "lucide-react";
import { TabType } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: TabType;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  newInquiriesCount: number;
}

const tabTitles: Record<TabType, string> = {
  overview: "Dashboard Overview",
  services: "Manage Services",
  testimonials: "Manage Testimonials",
  gallery: "Manage Gallery",
  inquiries: "Contact Inquiries",
  settings: "Settings",
};

export const AdminHeader = ({
  activeTab,
  sidebarOpen,
  setSidebarOpen,
  newInquiriesCount,
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Sample notifications data (in a real app, this would come from an API)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "inquiry" as const,
      title: "New Contact Inquiry",
      message: "Sarah Johnson submitted a contact form",
      time: "2 minutes ago",
      unread: true,
      action: () => navigate("/admin"),
    },
    {
      id: 2,
      type: "testimonial" as const,
      title: "New Testimonial",
      message: "Mike Chen submitted a testimonial for approval",
      time: "1 hour ago",
      unread: true,
      action: () => navigate("/admin"),
    },
    {
      id: 3,
      type: "system" as const,
      title: "Backup Completed",
      message: "Database backup completed successfully",
      time: "3 hours ago",
      unread: false,
      action: null,
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Quick actions based on current tab
  const getQuickActions = () => {
    switch (activeTab) {
      case "services":
        return [
          { label: "Add New Service", action: () => navigate("/admin"), icon: Plus },
          { label: "View All Services", action: () => navigate("/services"), icon: Eye },
        ];
      case "testimonials":
        return [
          { label: "Add Testimonial", action: () => navigate("/admin"), icon: Plus },
          { label: "View Testimonials", action: () => navigate("/testimonials"), icon: Eye },
        ];
      case "gallery":
        return [
          { label: "Upload Image", action: () => navigate("/admin"), icon: Plus },
          { label: "View Gallery", action: () => navigate("/gallery"), icon: Eye },
        ];
      case "inquiries":
        return [
          { label: "View New Inquiries", action: () => navigate("/admin"), icon: Eye },
        ];
      default:
        return [
          { label: "View Site", action: () => navigate("/"), icon: Eye },
          { label: "Settings", action: () => navigate("/admin"), icon: Settings },
        ];
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    // Clear auth data and redirect
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
    );

    // Close dropdown
    setNotificationsOpen(false);

    // Execute action if available
    if (notification.action) {
      notification.action();
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-muted transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="font-heading text-lg lg:text-xl font-semibold text-foreground">
              {tabTitles[activeTab]}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Welcome back, Administrator
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              title="Quick Actions"
            >
              <Plus className="w-5 h-5 text-foreground/70" />
            </button>

            {quickActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                    Quick Actions
                  </div>
                  {getQuickActions().map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          setQuickActionsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground/70" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Stay updated with recent activity</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'inquiry' ? 'bg-blue-500/10 text-blue-600' :
                            notification.type === 'testimonial' ? 'bg-green-500/10 text-green-600' :
                            'bg-gray-500/10 text-gray-600'
                          }`}>
                            {notification.type === 'inquiry' && <Bell className="w-4 h-4" />}
                            {notification.type === 'testimonial' && <Edit className="w-4 h-4" />}
                            {notification.type === 'system' && <Settings className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border">
                    <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>

          <Link
            to="/"
            className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-muted"
          >
            View Site <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
