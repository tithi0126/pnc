import { useState } from "react";
import { Eye, EyeOff, Trophy, Calendar, Trash2, Plus, Edit2 } from "lucide-react";
import { awardsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "../Modal";
import { ImageUpload } from "../ImageUpload";
import { colors } from "@/theme/colors";

interface Award {
  id: string;
  title: string;
  description?: string;
  organization?: string;
  date: string;
  type: 'award' | 'event';
  images: string[];
  is_active: boolean;
  sort_order: number;
}

interface AwardsTabProps {
  awards: Award[];
  onRefresh: () => void;
}

export const AwardsTab = ({ awards, onRefresh }: AwardsTabProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await awardsAPI.toggleStatus(id);
      toast({ title: isActive ? "Award/Event hidden" : "Award/Event activated" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this award/event?")) return;

    try {
      await awardsAPI.delete(id);
      toast({ title: "Award/Event deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: Award) => {
    try {
      // Transform field names from frontend format to backend format
      const transformedData = {
        title: formData.title,
        description: formData.description,
        organization: formData.organization,
        date: formData.date,
        type: formData.type,
        images: formData.images,
        isActive: formData.is_active,
        sortOrder: formData.sort_order,
      };

      if (formData.id) {
        await awardsAPI.update(formData.id, transformedData);
        toast({ title: "Award/Event updated" });
      } else {
        await awardsAPI.create(transformedData);
        toast({ title: "Award/Event created" });
      }
      setEditingAward(null);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredAwards = awards.filter(award => {
    if (filter === "active") return award.is_active;
    if (filter === "inactive") return !award.is_active;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Awards & Events</h2>
          <p className="text-sm text-muted-foreground">{filteredAwards.length} of {awards.length} awards/events</p>
        </div>
        <button
          onClick={() => setEditingAward({
            id: "", title: "", description: "", organization: "",
            date: new Date().toISOString().split('T')[0],
            type: "award", images: [], is_active: true, sort_order: 0
          })}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add Award/Event
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          All ({awards.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "active" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Active ({awards.filter(a => a.is_active).length})
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "inactive" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Inactive ({awards.filter(a => !a.is_active).length})
        </button>
      </div>

      <div className="grid gap-4">
        {filteredAwards.map((award) => (
          <div key={award.id} className="bg-card rounded-2xl p-5 border border-border hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      award.type === 'award' ? colors.awardsIconAward : colors.awardsIconEvent
                    }`}
                  >
                    {award.type === 'award' ? <Trophy className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{award.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          award.type === 'award' ? colors.awardsPillAward : colors.awardsPillEvent
                        }`}
                      >
                        {award.type === 'award' ? 'Award' : 'Event'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        award.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {award.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {award.organization && (
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Organization:</strong> {award.organization}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Date:</strong> {new Date(award.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                {award.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{award.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleStatus(award.id, award.is_active)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                  title={award.is_active ? "Hide" : "Show"}
                >
                  {award.is_active ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => setEditingAward(award)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-foreground/70" />
                </button>
                <button
                  onClick={() => handleDelete(award.id)}
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

      {/* Award Modal */}
      {editingAward && (
        <AwardFormModal
          award={editingAward}
          onClose={() => setEditingAward(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AwardFormModal = ({
  award,
  onClose,
  onSave
}: {
  award: Award;
  onClose: () => void;
  onSave: (data: Award) => void;
}) => {
  const [formData, setFormData] = useState(award);
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
      title={award.id ? "Edit Award/Event" : "Add Award/Event"}
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
              placeholder="Enter award/event title"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'award' | 'event' })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="award">Award</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Organization</label>
            <input
              type="text"
              value={formData.organization || ""}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="e.g., Nutrition Association"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Enter award/event description"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="space-y-4">
              {/* Display existing images */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Award image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className={`absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${colors.awardsImageDeleteButton}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload new image */}
              <ImageUpload
                onImageUpload={(url) => {
                  const newImages = [...(formData.images || []), url];
                  setFormData({ ...formData, images: newImages });
                }}
                folder="awards"
              />
              <p className="text-sm text-muted-foreground">
                You can upload multiple images for this award/event. Each uploaded image will be added to the collection.
              </p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
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
            {isSubmitting ? "Saving..." : "Save Award/Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
