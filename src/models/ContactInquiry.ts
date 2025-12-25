import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: String,
  service: String,
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  },
  notes: String
}, {
  timestamps: true
});

// Index for status-based queries
ContactInquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
