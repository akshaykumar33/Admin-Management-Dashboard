import mongoose, { Document, Schema } from 'mongoose';

export interface IToolResource extends Document {
  toolName: string;
  description?: string;
  category: 'DevOps' | 'Frontend' | 'Backend' | 'Database' | 'Design' | 'Testing';
  officialUrl: string;
  documentationUrl?: string;
  logoUrl?: string;
  tags?: string[];
  techStack?: string[];
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  features?: string[];
  useCases?: string[];
  createdBy: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    email: string;
  };
  updatedBy?: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    email: string;
  };
  isActive: boolean;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ToolResourceSchema: Schema<IToolResource> = new Schema(
  {
    toolName: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['DevOps', 'Frontend', 'Backend', 'Database', 'Design', 'Testing'],
      required: true
    },
    officialUrl: { type: String, required: true },
    documentationUrl: { type: String },
    logoUrl: { type: String },
    tags: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    pricing: { type: String, enum: ['Free', 'Freemium', 'Paid', 'Open Source'], default: 'Free' },
    features: { type: [String], default: [] },
    useCases: { type: [String], default: [] },
    createdBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      userName: String,
      email: String
    },
    updatedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      userName: String,
      email: String
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5 }
  },
  { timestamps: true }
);

const ToolResource = mongoose.model<IToolResource>('ToolResource', ToolResourceSchema);

export default ToolResource
