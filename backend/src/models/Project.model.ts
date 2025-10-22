import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  projectName: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate?: Date;
  endDate?: Date;
  projectUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  pdfDocuments?: {
    title: string;
    url: string;
    uploadedAt?: Date;
    uploadedBy?: mongoose.Types.ObjectId;
  }[];
  technologies?: string[];
  teamMembers?: {
    memberId: mongoose.Types.ObjectId;
    memberType: 'User' | 'Intern';
    name: string;
    role: string;
    joinedAt?: Date;
  }[];
  manager?: {
    userId: mongoose.Types.ObjectId;
    name: string;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    projectName: { type: String, required: true, trim: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
      default: 'Planning'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    projectUrl: { type: String },
    repositoryUrl: { type: String },
    documentationUrl: { type: String },
    pdfDocuments: [
      {
        title: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    technologies: { type: [String], default: [] },
    teamMembers: [
      {
        memberId: { type: Schema.Types.ObjectId, refPath: 'teamMembers.memberType' },
        memberType: { type: String, enum: ['User', 'Intern'] },
        name: { type: String },
        role: { type: String },
        joinedAt: { type: Date, default: Date.now }
      }
    ],
    manager: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      name: { type: String }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
