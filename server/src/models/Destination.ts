import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  id: string;
  name: string;
  slug: string;
  state: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit?: string;
  recommendedDuration?: string;
  travelHighlights: string[];
  experiences: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const destinationSchema = new Schema<IDestination>(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image URL is required'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    bestTimeToVisit: {
      type: String,
      default: '',
    },
    recommendedDuration: {
      type: String,
      default: '',
    },
    travelHighlights: {
      type: [String],
      default: [],
    },
    experiences: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, default: '' },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

destinationSchema.index({ isPublished: 1, name: 1 });

export const Destination = mongoose.model<IDestination>('Destination', destinationSchema);
