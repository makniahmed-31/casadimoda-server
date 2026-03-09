import mongoose, { Schema, Document, Model } from "mongoose";

export type CouponType = "percentage" | "fixed";

export interface ICoupon extends Document {
  code: string;
  discount: number; // percentage or fixed amount
  type: CouponType;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
