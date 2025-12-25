import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  altText?: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  altText: String,
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Index for active gallery images
GallerySchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model<IGallery>('Gallery', GallerySchema);
