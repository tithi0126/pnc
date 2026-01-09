import { FileText, MessageSquare, Image, Mail, TrendingUp, Clock, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { StatsCard } from "../StatsCard";

interface OverviewTabProps {
  stats: {
    services: number;
    approvedTestimonials: number;
    galleryImages: number;
    newInquiries: number;
  };
  recentInquiries: Array<{
    _id: string;
    name: string;
    email: string;
    status: string | null;
    created_at: string;
  }>;
  dbStatus?: {
    localStorage: { connected: boolean; type: string; message: string };
    mongodb: { connected: boolean; type: string; message: string };
  };
  onTabChange?: (tab: string) => void;
  onReviewPending?: () => void;
}

export const OverviewTab = ({ stats, recentInquiries, dbStatus, onTabChange, onReviewPending }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Active Services"
          value={stats.services}
          icon={FileText}
          color="primary"
        />
        <StatsCard
          label="Approved Reviews"
          value={stats.approvedTestimonials}
          icon={MessageSquare}
          color="accent"
        />
        <StatsCard
          label="Gallery Images"
          value={stats.galleryImages}
          icon={Image}
          color="sage"
        />
        <StatsCard
          label="New Inquiries"
          value={stats.newInquiries}
          icon={Mail}
          color="terracotta"
        />
      </div>



      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onTabChange?.("services")}
              className="p-4 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors text-left group cursor-pointer"
            >
              <FileText className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm text-foreground">Add Service</p>
              <p className="text-xs text-muted-foreground">Create new service</p>
            </button>
            <button
              onClick={() => onTabChange?.("gallery")}
              className="p-4 rounded-xl bg-accent/5 hover:bg-accent/10 border border-accent/20 transition-colors text-left group cursor-pointer"
            >
              <Image className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm text-foreground">Upload Image</p>
              <p className="text-xs text-muted-foreground">Add to gallery</p>
            </button>
            <button
              onClick={() => {
                onTabChange?.("testimonials");
                onReviewPending?.();
              }}
              className="p-4 rounded-xl bg-sage/5 hover:bg-sage/10 border border-sage/20 transition-colors text-left group cursor-pointer"
            >
              <MessageSquare className="w-6 h-6 text-sage mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm text-foreground">Review</p>
              <p className="text-xs text-muted-foreground">Pending testimonials</p>
            </button>
            <button
              onClick={() => onTabChange?.("inquiries")}
              className="p-4 rounded-xl bg-terracotta/5 hover:bg-terracotta/10 border border-terracotta/20 transition-colors text-left group cursor-pointer"
            >
              <Mail className="w-6 h-6 text-terracotta mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm text-foreground">Messages</p>
              <p className="text-xs text-muted-foreground">View inquiries</p>
            </button>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Inquiries
          </h3>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No inquiries yet
              </p>
            ) : (
              recentInquiries.slice(0, 5).map((inquiry) => (
                <div 
                  key={inquiry._id} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground truncate">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{inquiry.email}</p>
                  </div>
                  <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    inquiry.status === "new" ? "bg-primary/10 text-primary" :
                    inquiry.status === "read" ? "bg-accent/10 text-accent" :
                    inquiry.status === "responded" ? "bg-sage/10 text-sage" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {inquiry.status || "new"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
