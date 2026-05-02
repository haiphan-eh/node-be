import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as PRODUCT_MODEL } from './product.model.js';

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: {
        totalPrice: { type: Number, required: true },
        totalDiscount: { type: Number, required: true },
        feeShip: { type: Number, required: true },
        totalPayment: { type: Number, required: true },
      },
      default: {},
    },
    order_shipping: {
      type: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
      },
      default: {},
    },
    order_products: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: PRODUCT_MODEL },
        shopId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    order_trackingNumber: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
    order_payment: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

type IOrder = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
};

export type OrderType = IOrder;
export const OrderModel = model<IOrder>(DOCUMENT_NAME, orderSchema);
