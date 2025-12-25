import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { servicesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "../Modal";

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

interface ServicesTabProps {
  services: Service[];
  onRefresh: () => void;
}

export const ServicesTab = ({ services, onRefresh }: ServicesTabProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await servicesAPI.delete(id);
      toast({ title: "Service deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: Service) => {
    try {
      console.log('Saving service:', formData);
      if (formData.id) {
        await servicesAPI.update(formData.id, formData);
        toast({ title: "Service updated" });
      } else {
        await servicesAPI.create(formData);
        toast({ title: "Service created" });
      }
      setEditingService(null);
      onRefresh();
    } catch (error: any) {
      console.error('Service save error:', error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Services</h2>
          <p className="text-sm text-muted-foreground">{services.length} total services</p>
        </div>
        <button
          onClick={() => setEditingService({ 
            id: "", title: "", short_description: "", full_description: "", 
            icon: "Apple", duration: "", ideal_for: "", benefits: [], 
            is_active: true, sort_order: 0 
          })}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-card rounded-2xl p-5 border border-border hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-foreground">{service.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    service.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.short_description}</p>
                {service.duration && (
                  <p className="text-xs text-muted-foreground mt-2">Duration: {service.duration}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-foreground/70" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {editingService && (
        <ServiceFormModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const ServiceFormModal = ({ 
  service, 
  onClose, 
  onSave 
}: { 
  service: Service; 
  onClose: () => void; 
  onSave: (data: Service) => void; 
}) => {
  const [formData, setFormData] = useState(service);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [benefitsText, setBenefitsText] = useState((service.benefits || []).join("\n"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      ...formData,
      benefits: benefitsText.split("\n").filter(b => b.trim()),
    });
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={service.id ? "Edit Service" : "Add Service"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Short Description *</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              value={formData.full_description || ""}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              value={formData.duration || ""}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 45-60 minutes"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ideal For</label>
            <input
              type="text"
              value={formData.ideal_for || ""}
              onChange={(e) => setFormData({ ...formData, ideal_for: e.target.value })}
              placeholder="e.g., Weight management"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Benefits (one per line)</label>
            <textarea
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              rows={3}
              placeholder="Enter each benefit on a new line"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-medium">Active (visible on website)</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? "Saving..." : "Save Service"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
