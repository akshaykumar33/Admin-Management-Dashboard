import mongoose, { Document, Schema } from 'mongoose';

export interface IIntern extends Document {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImage?: string;
    dateOfBirth?: Date;
    address?: string;
  };
  internshipDetails: {
    startDate: Date;
    endDate?: Date;
    duration?: string;
    department?: string;
    position?: string;
    mentor?: {
      userId: mongoose.Types.ObjectId;
      name: string;
    };
    status: 'Active' | 'Completed' | 'On Leave' | 'Terminated';
  };
  projects?: {
    projectId?: mongoose.Types.ObjectId;
    projectName?: string;
    role?: string;
    startDate?: Date;
    endDate?: Date;
    status?: 'In Progress' | 'Completed' | 'On Hold';
    projectUrl?: string;
    pdfUrl?: string;
    description?: string;
    technologies?: string[];
    teamMembers?: {
      memberId: mongoose.Types.ObjectId;
      memberType: 'User' | 'Intern';
      name: string;
      role: string;
    }[];
  }[];
  dailyComments?: {
    date: Date;
    comment: string;
    taskDescription?: string;
    hoursWorked?: number;
    status?: 'Completed' | 'In Progress' | 'Blocked';
    addedBy: {
      userId: mongoose.Types.ObjectId;
      userName: string;
      role: string;
    };
    createdAt?: Date;
  }[];
  meetingNotes?: {
    date: Date;
    title?: string;
    agenda?: string;
    notes: string;
    attendees?: string[];
    actionItems?: string[];
    nextMeetingDate?: Date;
    addedBy: {
      userId: mongoose.Types.ObjectId;
      userName: string;
      role: string;
    };
    createdAt?: Date;
  }[];
  skills?: {
    technical?: string[];
    soft?: string[];
    learning?: string[];
  };
  performance?: {
    overallRating?: number;
    punctuality?: number;
    codeQuality?: number;
    communication?: number;
    teamwork?: number;
    lastReviewDate?: Date;
    reviews?: {
      reviewDate?: Date;
      rating?: number;
      feedback?: string;
      reviewedBy?: {
        userId: mongoose.Types.ObjectId;
        name: string;
      };
    }[];
  };
  documents?: {
    documentType?: 'Resume' | 'Certificate' | 'ID Proof' | 'Offer Letter' | 'Other';
    documentUrl: string;
    uploadedAt?: Date;
    uploadedBy?: mongoose.Types.ObjectId;
  }[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const InternSchema: Schema<IIntern> = new Schema(
  {
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String },
      profileImage: { type: String },
      dateOfBirth: { type: Date },
      address: { type: String }
    },
    internshipDetails: {
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      duration: { type: String },
      department: { type: String },
      position: { type: String },
      mentor: {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String }
      },
      status: {
        type: String,
        enum: ['Active', 'Completed', 'On Leave', 'Terminated'],
        default: 'Active'
      }
    },
    projects: [
      {
        projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
        projectName: { type: String },
        role: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        status: {
          type: String,
          enum: ['In Progress', 'Completed', 'On Hold']
        },
        projectUrl: { type: String },
        pdfUrl: { type: String },
        description: { type: String },
        technologies: { type: [String] },
        teamMembers: [
          {
            memberId: { type: Schema.Types.ObjectId, refPath: 'projects.teamMembers.memberType' },
            memberType: { type: String, enum: ['User', 'Intern'] },
            name: { type: String },
            role: { type: String }
          }
        ]
      }
    ],
    dailyComments: [
      {
        date: { type: Date, required: true },
        comment: { type: String, required: true },
        taskDescription: { type: String },
        hoursWorked: { type: Number },
        status: { type: String, enum: ['Completed', 'In Progress', 'Blocked'] },
        addedBy: {
          userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          userName: { type: String },
          role: { type: String }
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    meetingNotes: [
      {
        date: { type: Date, required: true },
        title: { type: String },
        agenda: { type: String },
        notes: { type: String, required: true },
        attendees: { type: [String] },
        actionItems: { type: [String] },
        nextMeetingDate: { type: Date },
        addedBy: {
          userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          userName: { type: String },
          role: { type: String }
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    skills: {
      technical: { type: [String] },
      soft: { type: [String] },
      learning: { type: [String] }
    },
    performance: {
      overallRating: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      codeQuality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      teamwork: { type: Number, min: 1, max: 5 },
      lastReviewDate: { type: Date },
      reviews: [
        {
          reviewDate: { type: Date },
          rating: { type: Number },
          feedback: { type: String },
          reviewedBy: {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            name: { type: String }
          }
        }
      ]
    },
    documents: [
      {
        documentType: {
          type: String,
          enum: ['Resume', 'Certificate', 'ID Proof', 'Offer Letter', 'Other']
        },
        documentUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Intern = mongoose.model<IIntern>('Intern', InternSchema);

export default Intern;
