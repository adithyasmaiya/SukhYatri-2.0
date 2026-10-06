import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  id: string;
  userId: mongoose.Types.ObjectId | string;
  userName: string;
  userAvatar?: string;
  tripId: mongoose.Types.ObjectId | string;
  tripTitle?: string;
  bookingId: string;
  rating: number;
  title: string;
  comment: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    tripTitle: {
      type: String,
      default: '',
    },
    bookingId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isPublished: {
      type: Boolean,
      default: true,
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

export const Review = mongoose.model<IReview>('Review', reviewSchema);
