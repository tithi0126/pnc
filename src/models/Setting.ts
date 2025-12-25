import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for key lookups
SettingSchema.index({ key: 1 });

export default mongoose.model<ISetting>('Setting', SettingSchema);
