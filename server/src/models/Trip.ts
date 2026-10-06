import mongoose, { Document, Schema } from 'mongoose';

export interface IItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  location?: string;
  image?: string;
}

export interface ITrip extends Document {
  id: string;
  title: string;
  slug: string;
  destinationId?: mongoose.Types.ObjectId | string;
  destinationName: string;
  state: string;
  description: string;
  shortDescription: string;
  images: string[];
  duration: string;
  days: number;
  nights: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  travelStyle: string[];
  themes: string[];
  highlights: string[];
  itinerary: IItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodation?: {
    tier?: string;
    hotelName?: string;
    highlights?: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const itineraryDaySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: { type: [String], default: [] },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const tripSchema = new Schema<ITrip>(
  {
    title: {
      type: String,
      required: [true, 'Trip title is required'],
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
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: false,
    },
    destinationName: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
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
    images: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: 0,
      index: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    travelStyle: {
      type: [String],
      default: [],
      index: true,
    },
    themes: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    accommodation: {
      tier: { type: String, default: 'Heritage Boutique' },
      hotelName: { type: String, default: '' },
      highlights: { type: [String], default: [] },
    },
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
        // Also provide image alias for frontend backwards compatibility
        ret.image = ret.images?.[0] || '';
        ret.gallery = ret.images || [];
        ret.destName = ret.destinationName;
        ret.destination = ret.destinationName;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Search indexes for text search
tripSchema.index({
  title: 'text',
  destinationName: 'text',
  state: 'text',
  shortDescription: 'text',
  description: 'text',
});

// Supporting indexes for filtering & sorting
tripSchema.index({ isPublished: 1, createdAt: -1 });
tripSchema.index({ isPublished: 1, destinationName: 1 });
tripSchema.index({ isPublished: 1, price: 1 });

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
