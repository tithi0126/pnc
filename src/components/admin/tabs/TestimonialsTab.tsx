import { useState } from "react";
import { Eye, EyeOff, Star, Trash2, Plus, Edit2 } from "lucide-react";
import { testimonialsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "../Modal";
import { ImageUpload } from "../ImageUpload";
import { normalizeImageUrl } from "@/utils/imageUrl";

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

interface TestimonialsTabProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export const TestimonialsTab = ({ testimonials, onRefresh }: TestimonialsTabProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const handleToggleApproval = async (id: string, isApproved: boolean) => {
    try {
      await testimonialsAPI.toggleApproval(id);
      toast({ title: isApproved ? "Testimonial hidden" : "Testimonial approved" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await testimonialsAPI.toggleFeatured(id);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await testimonialsAPI.delete(id);
      toast({ title: "Testimonial deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: Testimonial) => {
    try {
      if (formData.id) {
        await testimonialsAPI.update(formData.id, formData);
        toast({ title: "Testimonial updated" });
      } else {
        await testimonialsAPI.create(formData);
        toast({ title: "Testimonial created" });
      }
      setEditingTestimonial(null);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "approved") return t.is_approved;
    if (filter === "pending") return !t.is_approved;
    return true;
  });

  const pendingCount = testimonials.filter(t => !t.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Testimonials</h2>
          <p className="text-sm text-muted-foreground">
            {testimonials.length} total • {pendingCount} pending approval
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditingTestimonial({
              id: "", name: "", role: "", location: "", content: "",
              rating: 5, image_url: "", is_approved: true, is_featured: false
            })}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
          {/* {(["all", "approved", "pending"] as const).map((f) => ( */}
          {/* {(["all"] as const).map((f) => (

            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))} */}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTestimonials.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 border border-border text-center">
            <p className="text-muted-foreground">No testimonials found</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`bg-card rounded-2xl p-5 border transition-all ${
                testimonial.is_approved ? "border-border" : "border-accent/50 bg-accent/5"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {testimonial.image_url ? (
                    <img
                      src={normalizeImageUrl(testimonial.image_url)}
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    {testimonial.is_featured && (
                      <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {[testimonial.role, testimonial.location].filter(Boolean).join(" • ")}
                  </p>
                  
                  {/* Rating */}
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating! ? "fill-accent text-accent" : "text-muted"}`} 
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-foreground/80 text-sm">{testimonial.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingTestimonial(testimonial)}
                    className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* <button
                    onClick={() => handleToggleFeatured(testimonial.id, testimonial.is_featured ?? false)}
                    className={`p-2 rounded-xl transition-colors ${
                      testimonial.is_featured
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                    title={testimonial.is_featured ? "Remove from featured" : "Add to featured"}
                  >
                    <Star className={`w-4 h-4 ${testimonial.is_featured ? "fill-current" : ""}`} />
                  </button> */}
                  <button
                    onClick={() => handleToggleApproval(testimonial.id, testimonial.is_approved ?? false)}
                    className={`p-2 rounded-xl transition-colors ${
                      testimonial.is_approved
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent hover:bg-primary/10 hover:text-primary"
                    }`}
                    title={testimonial.is_approved ? "Hide testimonial" : "Approve testimonial"}
                  >
                    {testimonial.is_approved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Testimonial Modal */}
      {editingTestimonial && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onClose={() => setEditingTestimonial(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const TestimonialFormModal = ({
  testimonial,
  onClose,
  onSave
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onSave: (data: Testimonial) => void;
}) => {
  const [formData, setFormData] = useState(testimonial);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={testimonial.id ? "Edit Testimonial" : "Add Testimonial"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              value={formData.role || ""}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Patient"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Surat, Gujarat"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <select
              value={formData.rating || 5}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <ImageUpload
              value={formData.image_url || ""}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              bucket="testimonials"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_approved ?? false}
                onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-medium">Approved (visible on website)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? "Saving..." : "Save Testimonial"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
