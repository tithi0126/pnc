import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { normalizeImageUrl } from "@/utils/imageUrl";
require('dotenv').config();
interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  bucket?: 'gallery' | 'testimonials' | 'awards' | 'services';
  folder?: string; // Alternative prop name for backward compatibility
  currentImage?: string; // Alternative prop name
  className?: string;
  onImageUpload?: (url: string) => void; // Alternative callback
}

export const ImageUpload = ({
  value,
  onChange,
  bucket,
  folder,
  currentImage,
  onImageUpload,
  className = ""
}: ImageUploadProps) => {
  // Handle alternative prop names for backward compatibility
  const actualValue = value || currentImage || "";
  const actualOnChange = onChange || onImageUpload;
  const actualBucket = bucket || folder || 'gallery';
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");

  // Update preview when actualValue changes
  useEffect(() => {
    setPreview(normalizeImageUrl(actualValue));
  }, [actualValue]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('bucket', actualBucket);

      const API_BASE_URL = import.meta.env.VITE_API_URL
      || 'https://api.pncpriyamnutritioncare.com/api'
      // || 'http://localhost:5003/api'
      ;

      const token = localStorage.getItem('authToken');

      // Try backend upload first
      try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // Use the URL returned from backend (constructed with PUBLIC_BASE_URL)
          const imageUrl = data.url || `${API_BASE_URL.replace('/api', '')}/api/uploads/${data.filename}`;

          setPreview(normalizeImageUrl(imageUrl));
          actualOnChange?.(normalizeImageUrl(imageUrl));

          toast({
            title: "Image uploaded",
            description: "Your image has been uploaded successfully.",
          });
          setIsUploading(false);
          return;
        }
      } catch (backendError) {
        console.error('Backend upload failed:', backendError);
        toast({
          title: "Upload failed",
          description: "Unable to upload image. Please try again or contact support.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };

      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Could not process the image file.",
        });
        setIsUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    actualOnChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-border"
            onError={(e) => {
              console.error('Image preview failed to load:', preview);
            }}
            onLoad={() => {
              console.log('Image preview loaded successfully:', preview);
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
            </>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="btn-outline text-sm w-full"
      >
        {isUploading ? "Uploading..." : "Choose Image"}
      </button>
    </div>
  );
};
