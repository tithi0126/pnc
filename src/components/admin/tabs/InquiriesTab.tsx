import { useState } from "react";
import { Mail, Phone, Calendar, MessageSquare, ExternalLink } from "lucide-react";
import { contactAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  serviceName?: string;
  serviceType?: string;
  message: string;
  status: string | null;
  notes: string | null;
  created_at: string;
}

interface InquiriesTabProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

const statusOptions = [
  { value: "new", label: "New", color: "bg-primary/10 text-primary" },
  { value: "read", label: "Read", color: "bg-accent/10 text-accent" },
  { value: "responded", label: "Responded", color: "bg-sage/10 text-sage" },
  { value: "archived", label: "Archived", color: "bg-muted text-muted-foreground" },
];

export const InquiriesTab = ({ inquiries, onRefresh }: InquiriesTabProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast({ title: `Status updated to ${status}` });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    try {
      await contactAPI.updateNotes(id, notes);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredInquiries = filter === "all" 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const counts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === "new").length,
    read: inquiries.filter(i => i.status === "read").length,
    responded: inquiries.filter(i => i.status === "responded").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Contact Inquiries</h2>
          <p className="text-sm text-muted-foreground">
            {counts.new} new • {inquiries.length} total
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: `All (${counts.all})` },
          { value: "new", label: `New (${counts.new})` },
          { value: "read", label: `Read (${counts.read})` },
          { value: "responded", label: `Responded (${counts.responded})` },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.value 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 border border-border text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No inquiries found</p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry._id}
              className={`bg-card rounded-2xl border transition-all ${
                inquiry.status === "new" ? "border-primary/50" : "border-border"
              }`}
            >
              {/* Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === inquiry._id ? null : inquiry._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{inquiry.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusOptions.find(s => s.value === inquiry.status)?.color || statusOptions[0].color
                      }`}>
                        {inquiry.status || "new"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {inquiry.email}
                      </span>
                      {inquiry.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {inquiry.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {inquiry.serviceName && (
                      <p className="text-xs text-primary mt-2">
                        {inquiry.serviceType === 'service' ? 'Service' : inquiry.serviceType === 'product' ? 'Product' : 'Inquiry'}: {inquiry.serviceName}
                      </p>
                    )}
                  </div>
                  <select
                    value={inquiry.status || "new"}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(inquiry._id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === inquiry._id && (
                <div className="px-5 pb-5 pt-0 border-t border-border mt-0">
                  <div className="pt-4 space-y-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Message</h5>
                      <p className="text-foreground/80 text-sm bg-muted/50 rounded-xl p-4">
                        {inquiry.message}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Internal Notes</h5>
                      <textarea
                        defaultValue={inquiry.notes || ""}
                        onBlur={(e) => handleNotesUpdate(inquiry._id, e.target.value)}
                        placeholder="Add notes about this inquiry..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="btn-outline text-sm inline-flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" /> Reply via Email
                      </a>
                      {inquiry.phone && (
                        <a
                          href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm inline-flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
