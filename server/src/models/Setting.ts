import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: any;
  updatedBy?: string;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    updatedBy: {
      type: String,
      default: '',
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

export const Setting = mongoose.model<ISetting>('Setting', settingSchema);
