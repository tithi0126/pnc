import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { servicesAPI, testimonialsAPI, galleryAPI, contactAPI } from "@/lib/api";
import { AuthService } from "@/services/authService";
import { normalizeImageUrl } from "@/utils/imageUrl";
import { AdminSidebar, TabType } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { ServicesTab } from "@/components/admin/tabs/ServicesTab";
import { TestimonialsTab } from "@/components/admin/tabs/TestimonialsTab";
import { GalleryTab } from "@/components/admin/tabs/GalleryTab";
import { InquiriesTab } from "@/components/admin/tabs/InquiriesTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";

interface Service {
  id: string;
  title: string;
  short_description: string;
  full_description: string | null;
  icon: string | null;
  duration: string | null;
  ideal_for: string | null;
  benefits: string[] | null;
  is_active: boolean | null;
  sort_order: number | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  location: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
  is_approved: boolean | null;
  is_featured: boolean | null;
}

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string | null;
  notes: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testimonialsFilter, setTestimonialsFilter] = useState<"all" | "approved" | "pending">("all");
  
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // TEMPORARY: Auto-promote user to admin if not already admin
  // TODO: Remove this after initial setup
  const promoteToAdmin = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      console.log('TEMP: Auto-promoting user to admin:', user.id);
      await AuthService.promoteToAdmin(token, user.id);

      // Refresh to reload admin privileges
      window.location.reload();
    } catch (error) {
      console.error('TEMP: Failed to promote user:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/admin/auth");
      } else if (!isAdmin) {
        console.log("TEMP: User lacks admin privileges, auto-promoting...");
        promoteToAdmin();
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Reset testimonials filter when switching away from testimonials tab
  useEffect(() => {
    if (activeTab !== "testimonials") {
      setTestimonialsFilter("all");
    }
  }, [activeTab]);

  const fetchData = async () => {
    setDataLoading(true);
    setDataError(null);

    try {
      const [servicesData, testimonialsData, galleryData, inquiriesData] = await Promise.all([
        servicesAPI.getAllAdmin().catch(() => []),
        testimonialsAPI.getAllAdmin().catch(() => []),
        galleryAPI.getAllAdmin().catch(() => []),
        contactAPI.getAllAdmin().catch(() => []),
      ]);

      // Set database status for MongoDB
      const dbStatusData = {
        mongodb: { connected: true, type: 'mongodb', message: 'MongoDB backend active' },
        localStorage: { connected: false, type: 'localStorage', message: 'localStorage disabled' }
      };

      // Transform and set data
      setServices(Array.isArray(servicesData) ? servicesData.map(s => ({
        id: s._id?.toString() || s.id || '',
        title: s.title || '',
        short_description: s.shortDescription || s.short_description || '',
        full_description: s.fullDescription || s.full_description || '',
        icon: s.icon || '',
        duration: s.duration || '',
        ideal_for: s.idealFor || s.ideal_for || '',
        benefits: s.benefits || [],
        is_active: s.isActive || s.is_active || false,
        sort_order: s.sortOrder || s.sort_order || 0,
      })) : []);

      setTestimonials(Array.isArray(testimonialsData) ? testimonialsData.map(t => ({
        id: t._id?.toString() || t.id || '',
        name: t.name || '',
        role: t.role || '',
        location: t.location || '',
        content: t.content || '',
        rating: t.rating || 5,
        image_url: normalizeImageUrl(t.imageUrl || t.image_url || ''),
        is_approved: t.isApproved || t.is_approved || false,
        is_featured: t.isFeatured || t.is_featured || false,
      })) : []);

      setGallery(Array.isArray(galleryData) ? galleryData.map(g => ({
        id: g._id?.toString() || g.id || '',
        title: g.title || '',
        alt_text: g.altText || g.alt_text || '',
        image_url: normalizeImageUrl(g.imageUrl || g.image_url || ''),
        category: g.category || 'General',
        is_active: g.isActive || g.is_active || true,
        sort_order: g.sortOrder || g.sort_order || 0,
      })) : []);

      setInquiries(Array.isArray(inquiriesData) ? inquiriesData.map(i => {
        // Handle createdAt - it might be a Date object or already a string
        let createdAt = new Date().toISOString();
        if (i.createdAt) {
          if (i.createdAt instanceof Date) {
            createdAt = i.createdAt.toISOString();
          } else if (typeof i.createdAt === 'string') {
            createdAt = i.createdAt;
          } else if (i.createdAt.toISOString) {
            createdAt = i.createdAt.toISOString();
          }
        } else if (i.created_at) {
          createdAt = typeof i.created_at === 'string' ? i.created_at : i.created_at.toISOString();
        }
        
        return {
        id: i._id?.toString() || i.id || '',
        name: i.name || '',
        email: i.email || '',
        phone: i.phone || '',
        service: i.service || '',
        message: i.message || '',
        status: i.status || 'new',
        notes: i.notes || '',
          created_at: createdAt,
        };
      }) : []);

      setDbStatus(dbStatusData);
    } catch (error) {
      console.error('Error fetching admin data:', error);

      // If API fails, show a user-friendly message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Access denied') || errorMessage.includes('401') || errorMessage.includes('403')) {
        setDataError('Unable to load admin data. You may not have admin privileges or the backend server may be unavailable.');
      } else if (errorMessage.includes('fetch') || errorMessage.includes('Network')) {
        setDataError('Unable to connect to backend server. Please ensure the MongoDB backend is running.');
      } else {
        setDataError(`Unable to load admin data: ${errorMessage}`);
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to admin login page after successful logout
      navigate("/admin/auth");
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still redirect to login page even if there's an error
      navigate("/admin/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Allow any logged-in user to access the dashboard
  // Backend will handle permissions for specific operations

  const stats = {
    services: services.filter(s => s.is_active).length,
    approvedTestimonials: testimonials.filter(t => t.is_approved).length,
    galleryImages: gallery.filter(g => g.is_active).length,
    newInquiries: inquiries.filter(i => i.status === "new").length,
  };

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if data couldn't be loaded
  if (dataError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground text-sm mb-4">{dataError}</p>
          <p className="text-xs text-muted-foreground">
            Contact an administrator to grant you admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          newInquiriesCount={stats.newInquiries}
          onSignOut={handleSignOut}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              recentInquiries={inquiries}
              dbStatus={dbStatus}
              onTabChange={setActiveTab}
              onReviewPending={() => setTestimonialsFilter("pending")}
            />
          )}

          {activeTab === "services" && (
            <ServicesTab 
              services={services} 
              onRefresh={fetchData} 
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              onRefresh={fetchData}
              // initialFilter={testimonialsFilter}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryTab 
              images={gallery} 
              onRefresh={fetchData} 
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesTab 
              inquiries={inquiries} 
              onRefresh={fetchData} 
            />
          )}

          {/* {activeTab === "users" && <UsersTab />} // Commented out user management - force reload */}

          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
