import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  location?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: String,
  location: String,
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  imageUrl: String,
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for approved testimonials
TestimonialSchema.index({ isApproved: 1, createdAt: -1 });

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
