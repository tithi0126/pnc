import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, IndianRupee, ShoppingCart } from "lucide-react";
import { productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "../Modal";
import { ImageUpload } from "../ImageUpload";
import { normalizeImageUrl } from "@/utils/imageUrl";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  additionalImages?: string[];
  category?: string;
  isAvailable: boolean;
  isActive: boolean;
}

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => void;
}

const categories = ["Supplements", "Equipment", "Books", "Consultation Packages", "Health Foods", "Wellness Products"];

export const ProductsTab = ({ products, onRefresh }: ProductsTabProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productsAPI.delete(id);
      toast({ title: "Product deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await productsAPI.toggleActive(id);
      toast({ title: isActive ? "Product deactivated" : "Product activated" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await productsAPI.toggleAvailability(id);
      toast({ title: isAvailable ? "Product marked unavailable" : "Product marked available" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingProduct?._id) {
        await productsAPI.update(editingProduct._id, formData);
        toast({ title: "Product updated" });
      } else {
        await productsAPI.create(formData);
        toast({ title: "Product created" });
      }
      setEditingProduct(null);
      onRefresh();
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">{filteredProducts.length} of {products.length} products</p>
        </div>
        <button
          onClick={() => setEditingProduct({
            _id: "",
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            additionalImages: [],
            category: "Supplements",
            isAvailable: true,
            isActive: true
          })}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add Product
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`relative group rounded-2xl overflow-hidden bg-card border transition-all ${
              product.isActive && product.isAvailable ? "border-border" : "border-muted opacity-60"
            }`}
          >
            <div className="aspect-square">
              <img
                src={normalizeImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Status badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {!product.isActive && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Inactive
                  </span>
                )}
                {!product.isAvailable && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Unavailable
                  </span>
                )}
              </div>

            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleToggleActive(product._id, product.isActive)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title={product.isActive ? "Hide" : "Show"}
              >
                {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleToggleAvailability(product._id, product.isAvailable)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title={product.isAvailable ? "Mark Unavailable" : "Mark Available"}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingProduct(product)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-red-500 text-white rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="p-3 bg-card">
              <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
              <div className="flex items-center gap-1 mb-1">
                <IndianRupee className="w-3 h-3 text-primary" />
                <span className="font-bold text-primary text-sm">{product.price.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-muted-foreground">{product.category}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}

      {/* Product Modal */}
      {editingProduct && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};


const ProductFormModal = ({
  product,
  onClose,
  onSave
}: {
  product: Product;
  onClose: () => void;
  onSave: (data: Product) => void;
}) => {
  const [formData, setFormData] = useState(product);
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
      title={product._id ? "Edit Product" : "Add Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            placeholder="Enter product description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price (₹) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category || "Supplements"}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Product Image *</label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            folder="products"
          />
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailable ?? true}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
            />
            <span className="text-sm font-medium">Available for purchase</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
