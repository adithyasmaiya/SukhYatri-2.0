import mongoose, { Document, Schema } from 'mongoose';

export interface ITraveller {
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  age?: number;
  gender?: string;
  travellerType?: string;
  specialRequests?: string;
}

export interface IBookingPricing {
  baseAmount: number;
  travellerCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  taxes: number;
  totalAmount: number;
  currency: string;
}

export interface IBookingCancellation {
  cancelledAt?: Date;
  reason?: string;
  cancellationFee?: number;
  refundAmount?: number;
  policyTier?: string;
}

export type BookingLifecycleStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'payment_failed';

export type BookingPaymentStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface IBooking extends Document {
  id: string;
  bookingId: string;
  userId: mongoose.Types.ObjectId | string;
  tripId?: mongoose.Types.ObjectId | string;
  tripSnapshot: {
    id: string;
    title: string;
    image: string;
    destination: string;
    duration: string;
    price: number;
  };
  destinationName: string;
  travelDate: string;
  endDate: string;
  duration: string;
  slot?: string;
  travellers: number;
  adults: number;
  children: number;
  rooms?: number;
  roomCategory?: string;
  primaryTraveller: ITraveller;
  additionalTravellers: ITraveller[];
  pricing: IBookingPricing;
  paymentStatus: BookingPaymentStatus;
  paymentMethod: string;
  paymentId?: string;
  razorpayOrderId?: string;
  amountPaid?: number;
  bookingStatus: BookingLifecycleStatus;
  refundStatus: 'not_applicable' | 'initiated' | 'processing' | 'refunded';
  cancellation?: IBookingCancellation;
  invoiceNumber?: string;
  invoiceGeneratedAt?: Date;
  confirmationEmailSentAt?: Date;
  cancellationEmailSentAt?: Date;
  refundEmailSentAt?: Date;
  reviewSubmitted?: boolean;
  review?: {
    rating: number;
    title: string;
    comment: string;
    createdAt?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: false,
      index: true,
    },
    tripSnapshot: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      destination: { type: String, required: true },
      duration: { type: String, required: true },
      price: { type: Number, required: true },
    },
    destinationName: {
      type: String,
      required: true,
      trim: true,
    },
    travelDate: {
      type: String,
      required: true,
      index: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      default: 'Morning departure (09:00 AM)',
    },
    travellers: {
      type: Number,
      required: true,
      min: 1,
    },
    adults: {
      type: Number,
      default: 1,
      min: 1,
    },
    children: {
      type: Number,
      default: 0,
    },
    rooms: {
      type: Number,
      default: 1,
    },
    roomCategory: {
      type: String,
      default: 'Heritage Boutique',
    },
    primaryTraveller: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      dob: { type: String, default: '' },
      gender: { type: String, default: 'Not specified' },
      specialRequests: { type: String, default: '' },
    },
    additionalTravellers: [
      {
        name: { type: String, required: true },
        age: { type: Number },
        gender: { type: String, default: 'Companion' },
      },
    ],
    pricing: {
      baseAmount: { type: Number, required: true },
      travellerCount: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      couponCode: { type: String },
      taxes: { type: Number, required: true },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
    },
    paymentId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['created', 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'razorpay',
    },
    bookingStatus: {
      type: String,
      enum: ['pending_payment', 'confirmed', 'completed', 'cancelled', 'payment_failed'],
      default: 'pending_payment',
      index: true,
    },
    refundStatus: {
      type: String,
      enum: ['not_applicable', 'initiated', 'processing', 'refunded'],
      default: 'not_applicable',
    },
    cancellation: {
      cancelledAt: { type: Date },
      reason: { type: String },
      cancellationFee: { type: Number },
      refundAmount: { type: Number },
      policyTier: { type: String },
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
    review: {
      rating: { type: Number },
      title: { type: String },
      comment: { type: String },
      createdAt: { type: String },
    },
    invoiceNumber: { type: String, index: true },
    invoiceGeneratedAt: { type: Date },
    confirmationEmailSentAt: { type: Date },
    cancellationEmailSentAt: { type: Date },
    refundEmailSentAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret.bookingId || ret._id.toString();
        // Backward-compatible properties for frontend components
        ret.packageId = ret.tripSnapshot?.id;
        ret.packageTitle = ret.tripSnapshot?.title;
        ret.packageImage = ret.tripSnapshot?.image;
        ret.destName = ret.destinationName;
        ret.destination = ret.destinationName;
        ret.baseAmount = ret.pricing?.baseAmount;
        ret.discountAmount = ret.pricing?.discount || 0;
        ret.taxAmount = ret.pricing?.taxes || 0;
        ret.totalAmount = ret.pricing?.totalAmount;
        ret.couponApplied = ret.pricing?.couponCode;
        ret.couponCode = ret.pricing?.couponCode;
        ret.leadGuest = ret.primaryTraveller;
        ret.paymentId = ret.paymentId || (ret.paymentStatus === 'paid' ? `PAY-${ret.bookingId?.replace('SKY-', '')}` : undefined);
        ret.razorpayOrderId = ret.razorpayOrderId;
        ret.amountPaid = ret.amountPaid !== undefined ? ret.amountPaid : (ret.paymentStatus === 'paid' ? ret.pricing?.totalAmount : 0);
        ret.status = ret.bookingStatus === 'pending_payment'
          ? 'Pending Payment'
          : ret.bookingStatus === 'payment_failed'
          ? 'Payment Failed'
          : ret.bookingStatus.charAt(0).toUpperCase() + ret.bookingStatus.slice(1);
        if (ret.cancellation?.cancelledAt) {
          ret.cancelledAt = ret.cancellation.cancelledAt.toISOString().split('T')[0];
          ret.cancellationReason = ret.cancellation.reason;
          ret.cancellationFee = ret.cancellation.cancellationFee;
          ret.cancellationRefundAmount = ret.cancellation.refundAmount;
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
