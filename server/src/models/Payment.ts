import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface IPayment extends Document {
  id: string;
  paymentId: string;
  bookingId: string;
  userId: mongoose.Types.ObjectId | string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  errorMessage?: string;
  refundId?: string;
  refundAmount?: number;
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    bookingId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      index: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountInPaise: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'created',
      index: true,
    },
    method: {
      type: String,
      default: 'razorpay',
    },
    errorMessage: {
      type: String,
    },
    refundId: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret.paymentId || ret._id.toString();
        // Never expose internal signature or raw IDs outside
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

paymentSchema.index({ bookingId: 1, status: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
