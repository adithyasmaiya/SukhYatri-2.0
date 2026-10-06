import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  adminUserId: mongoose.Types.ObjectId | string;
  adminEmail?: string;
  action: string;
  entityType: 'package' | 'destination' | 'coupon' | 'review' | 'booking' | 'user' | 'payment' | 'settings';
  entityId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    adminUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    adminEmail: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['package', 'destination', 'coupon', 'review', 'booking', 'user', 'payment', 'settings'],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
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

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
