import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { galleryAPI, settingsAPI } from "@/lib/api";

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState({
    gallery_page_title: 'Our Gallery',
    gallery_page_subtitle: 'Explore our nutrition and wellness journey',
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await galleryAPI.getAll();

        // Transform MongoDB data to match interface
        const transformed = (data || []).map((img: any) => ({
          id: img._id?.toString() || img.id || '',
          title: img.title || '',
          alt_text: img.altText || img.alt_text || '',
          image_url: img.imageUrl || img.image_url || '',
          category: img.category || '',
          is_active: img.isActive ?? img.is_active ?? true,
          sort_order: img.sortOrder || img.sort_order || 0,
        }));

        setGalleryImages(transformed);
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(transformed.map(img => img.category).filter(Boolean) as string[])];
        setCategories(uniqueCategories);

        // Fetch settings
        const allSettings = await settingsAPI.getPublic();
        const settingsMap: any = allSettings || {};
        setPageSettings({
          gallery_page_title: settingsMap.gallery_page_title || pageSettings.gallery_page_title,
          gallery_page_subtitle: settingsMap.gallery_page_subtitle || pageSettings.gallery_page_subtitle,
        });
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter for active images only, then by category
  const activeImages = galleryImages.filter(img => img.is_active);

  const filteredImages = selectedCategory === "All"
    ? activeImages
    : activeImages.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Gallery</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              {pageSettings.gallery_page_title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {pageSettings.gallery_page_subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
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
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-card rounded-2xl p-8 border border-border max-w-md mx-auto">
                <p className="text-muted-foreground mb-2">No images found</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCategory === "All"
                    ? "No active images available"
                    : `No active images in the "${selectedCategory}" category`
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Gallery Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image.image_url)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium mb-2">
                        {image.category}
                      </span>
                      <p className="text-primary-foreground text-sm">{image.title}</p>
                      {!image.is_active && (
                        <span className="inline-block px-2 py-1 rounded-full bg-red-500/90 text-white text-xs font-medium mt-1">
                          INACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-background" />
          </button>
          <img
            src={selectedImage.replace("w=800&h=600", "w=1200&h=900")}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
