import { useState, useEffect, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { colors } from "@/theme/colors";
import { normalizeImageUrl, getDirectUploadsUrl } from "@/utils/imageUrl";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  directUploads?: boolean; // Use direct uploads paths without /api prefix
}

export const ImageModal = ({ images, currentIndex, isOpen, onClose, title, directUploads = false }: ImageModalProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  // Normalize all image URLs for proper preview
  const normalizedImages = useMemo(() => {
    if (directUploads) {
      return images.map(image => getDirectUploadsUrl(image) || image);
    }
    return images.map(image => normalizeImageUrl(image) || image);
  }, [images, directUploads]);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setActiveIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${colors.imageModalOverlay}`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${colors.imageModalButton}`}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {normalizedImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-colors ${colors.imageModalButton}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-colors ${colors.imageModalButton}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main image */}
      <div className="relative max-w-4xl max-h-screen p-4">
        <img
          src={normalizedImages[activeIndex]}
          alt={title || `Image ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />

        {/* Image counter */}
        {normalizedImages.length > 1 && (
          <div
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm ${colors.imageModalCounter}`}
          >
            {activeIndex + 1} / {normalizedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      {normalizedImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
          {normalizedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? colors.imageModalThumbnailActive
                  : colors.imageModalThumbnailInactive
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Title overlay */}
      {title && (
        <div
          className={`absolute top-4 left-4 right-16 px-4 py-2 rounded-lg ${colors.imageModalTitle}`}
        >
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
      )}
    </div>
  );
};
