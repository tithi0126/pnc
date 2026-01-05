import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { ShoppingCart, Package, Star, IndianRupee, CheckCircle, XCircle } from "lucide-react";
import { ProductService } from "@/services/productService";
import { RazorpayService } from "@/services/razorpayService";
import { ImageModal } from "@/components/ImageModal";
import { normalizeImageUrl } from "@/utils/imageUrl";
import { colors } from "@/theme/colors";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  additionalImages?: string[];
  category: string;
  stockQuantity: number;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  razorpayProductId?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getAllProducts();
        setProducts(data);
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(product => product.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openImageModal = (images: string[], startIndex: number = 0, title: string = '') => {
    setImageModal({
      isOpen: true,
      images,
      currentIndex: startIndex,
      title
    });
  };

  const closeImageModal = () => {
    setImageModal(prev => ({ ...prev, isOpen: false }));
  };

  const handlePurchase = async (product: Product) => {
    try {
      setIsProcessing(product._id);

      await RazorpayService.initiatePayment(
        product.price,
        product.name,
        {
          name: '', // You can collect customer details in a form
          email: '',
          contact: '',
        },
        // Success handler
        async (response) => {
          console.log('Payment successful:', response);

          // Verify payment on backend
          const verification = await RazorpayService.verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (verification.success) {
            setPaymentStatus({ type: 'success', message: 'Payment successful! Order confirmed.' });
            // You might want to redirect to a success page or show order details
          } else {
            setPaymentStatus({ type: 'error', message: 'Payment verification failed. Please contact support.' });
          }
        },
        // Failure handler
        (error) => {
          console.error('Payment failed:', error);
          setPaymentStatus({ type: 'error', message: 'Payment failed. Please try again.' });
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      setPaymentStatus({ type: 'error', message: 'Failed to initiate payment. Please try again.' });
    } finally {
      setIsProcessing(null);
    }
  };

  // Filter for available products, then by category
  const availableProducts = products.filter(product => product.isAvailable && product.isActive);

  const filteredProducts = selectedCategory === "All"
    ? availableProducts
    : availableProducts.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Products</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Nutrition & Wellness Products
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover our range of premium nutrition supplements, health foods, and wellness products designed to support your journey to optimal health.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding">
        <div className="container-custom">

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-up">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-cta text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-card rounded-2xl p-8 border border-border max-w-md mx-auto">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory === "All"
                    ? "No products are currently available"
                    : `No products in the "${selectedCategory}" category`
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={normalizeImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => openImageModal(
                        [product.imageUrl, ...(product.additionalImages || [])],
                        0,
                        product.name
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium mb-2">
                          {product.category}
                        </span>
                        <p className="text-primary-foreground text-sm line-clamp-2">{product.name}</p>
                      </div>
                    </div>

                    {/* Stock Status */}
                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Only {product.stockQuantity} left
                      </div>
                    )}
                    {product.stockQuantity === 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                        {product.category}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={product.stockQuantity === 0 || isProcessing === product._id}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        product.stockQuantity === 0
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : isProcessing === product._id
                          ? "bg-muted text-muted-foreground cursor-wait"
                          : "bg-gradient-cta text-primary-foreground hover:shadow-lg hover:scale-105"
                      }`}
                    >
                      {isProcessing === product._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          {product.stockQuantity === 0 ? "Out of Stock" : "Buy Now"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="font-heading text-2xl font-bold mb-4">{selectedProduct.name}</h2>
              {/* Product detail modal content will be expanded */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-4 w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Notification */}
      {paymentStatus.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          paymentStatus.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {paymentStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{paymentStatus.message}</p>
          </div>
          <button
            onClick={() => setPaymentStatus({ type: null, message: '' })}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        images={imageModal.images}
        currentIndex={imageModal.currentIndex}
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        title={imageModal.title}
      />
    </Layout>
  );
};

export default Products;
