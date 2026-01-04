import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { galleryAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "../Modal";
import { ImageUpload } from "../ImageUpload";
import { normalizeImageUrl } from "@/utils/imageUrl";

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

interface GalleryTabProps {
  images: GalleryImage[];
  onRefresh: () => void;
}

const categories = ["General", "Healthy Food", "Consultation", "Events", "Nutrition", "Recipes"];

export const GalleryTab = ({ images, onRefresh }: GalleryTabProps) => {
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await galleryAPI.delete(id);
      toast({ title: "Image deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await galleryAPI.toggleActive(id);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: GalleryImage) => {
    try {
      if (formData.id) {
        await galleryAPI.update(formData.id, formData);
        toast({ title: "Image updated" });
      } else {
        await galleryAPI.create(formData);
        toast({ title: "Image added" });
      }
      setEditingImage(null);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Gallery</h2>
          <p className="text-sm text-muted-foreground">{images.length} total images</p>
        </div>
        <button
          onClick={() => setEditingImage({ 
            id: "", title: "", alt_text: "", image_url: "", 
            category: "General", is_active: true, sort_order: 0 
          })}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div 
            key={image.id} 
            className={`relative group rounded-2xl overflow-hidden bg-card border transition-all ${
              image.is_active ? "border-border" : "border-muted opacity-60"
            }`}
          >
            <div className="aspect-square">
              <img
                src={normalizeImageUrl(image.image_url)}
                alt={image.alt_text || image.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleToggleActive(image.id, image.is_active ?? true)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title={image.is_active ? "Hide" : "Show"}
              >
                {image.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditingImage(image)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="p-2 bg-background rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="p-3 bg-card">
              <p className="font-medium text-sm text-foreground truncate">{image.title}</p>
              <p className="text-xs text-muted-foreground">{image.category}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <p className="text-muted-foreground">No images found</p>
        </div>
      )}

      {/* Gallery Modal */}
      {editingImage && (
        <GalleryFormModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const GalleryFormModal = ({ 
  image, 
  onClose, 
  onSave 
}: { 
  image: GalleryImage; 
  onClose: () => void; 
  onSave: (data: GalleryImage) => void; 
}) => {
  const [formData, setFormData] = useState(image);
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
      title={image.id ? "Edit Image" : "Add Image"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Image *</label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="gallery"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Alt Text</label>
          <input
            type="text"
            value={formData.alt_text || ""}
            onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
            placeholder="Describe the image for accessibility"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category || "General"}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
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
        
        <div className="flex gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? "Saving..." : "Save Image"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
