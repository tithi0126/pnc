import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, IndianRupee, ShoppingCart } from "lucide-react";
import { ProductService } from "@/services/productService";
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
  isAvailable: boolean;
  isActive: boolean;
}

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => void;
}

export const ProductsTab = ({ products, onRefresh }: ProductsTabProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "unavailable">("all");
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await ProductService.deleteProduct(id, localStorage.getItem('token') || '');
      toast({ title: "Product deleted" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await ProductService.toggleActive(id, localStorage.getItem('token') || '');
      toast({ title: isActive ? "Product deactivated" : "Product activated" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await ProductService.toggleAvailability(id, localStorage.getItem('token') || '');
      toast({ title: isAvailable ? "Product marked unavailable" : "Product marked available" });
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const token = localStorage.getItem('token') || '';
      if (editingProduct?._id) {
        await ProductService.updateProduct(editingProduct._id, formData, token);
        toast({ title: "Product updated" });
      } else {
        await ProductService.createProduct(formData, token);
        toast({ title: "Product created" });
      }
      setEditingProduct(null);
      onRefresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredProducts = products.filter(product => {
    let matches = true;

    if (filter === "active") {
      matches = matches && product.isActive && product.isAvailable;
    } else if (filter === "inactive") {
      matches = matches && !product.isActive;
    } else if (filter === "unavailable") {
      matches = matches && !product.isAvailable;
    }

    return matches;
  });

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
            isAvailable: true,
            isActive: true
          })}
          className="btn-primary text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          All ({products.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "active" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Active ({products.filter(p => p.isActive && p.isAvailable).length})
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "inactive" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Inactive ({products.filter(p => !p.isActive).length})
        </button>
        <button
          onClick={() => setFilter("unavailable")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "unavailable" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Unavailable ({products.filter(p => !p.isAvailable).length})
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className={`relative group rounded-2xl overflow-hidden bg-card border transition-all ${
              product.isActive && product.isAvailable ? "border-border" : "border-muted opacity-60"
            }`}
          >
            <div className="aspect-square relative">
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

            <div className="p-4">
              <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <IndianRupee className="w-3 h-3 text-primary" />
                <span className="font-bold text-primary">{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleToggleActive(product._id, product.isActive)}
                className="p-2 bg-background rounded-xl hover:bg-muted transition-colors"
                title={product.isActive ? "Deactivate" : "Activate"}
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
                className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title={editingProduct?._id ? "Edit Product" : "Add New Product"}
      >
        {editingProduct && <ProductForm product={editingProduct} onSave={handleSave} onClose={() => setEditingProduct(null)} />}
      </Modal>
    </div>
  );
};

interface ProductFormProps {
  product: Product;
  onSave: (data: any) => void;
  onClose: () => void;
}

const ProductForm = ({ product, onSave, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || 0,
    imageUrl: product.imageUrl || "",
    additionalImages: product.additionalImages || [],
    isAvailable: product.isAvailable ?? true,
    isActive: product.isActive ?? true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="font-heading text-xl font-semibold">
        {product._id ? "Edit Product" : "Add New Product"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="Enter product name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
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
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="0.00"
          />
        </div>



        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Main Product Image *</label>
          <div className="space-y-4">
            {formData.imageUrl && (
              <img
                src={normalizeImageUrl(formData.imageUrl)}
                alt="Product"
                className="w-24 h-24 object-cover rounded-lg border border-border"
              />
            )}
            <ImageUpload
              onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
              folder="products"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
            />
            <span className="text-sm font-medium">Available for purchase</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
          {isSubmitting ? "Saving..." : (product._id ? "Update Product" : "Create Product")}
        </button>
      </div>
    </form>
  );
};
