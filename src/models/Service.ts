import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  icon?: string;
  duration?: string;
  idealFor?: string;
  benefits: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: String,
  icon: {
    type: String,
    default: 'Apple'
  },
  duration: String,
  idealFor: String,
  benefits: [{
    type: String,
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for sorting
ServiceSchema.index({ sortOrder: 1 });

export default mongoose.model<IService>('Service', ServiceSchema);
