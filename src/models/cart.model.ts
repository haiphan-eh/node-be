import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as PRODUCT_MODEL } from './product.model.js';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const CartState = ['active', 'completed', 'failed', 'pending'];

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: CartState,
    },
    cart_products: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: PRODUCT_MODEL },
        shopId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    cart_count_product: { type: Number, default: 0, required: true },
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

type ICart = InferSchemaType<typeof cartSchema> & {
  _id: Types.ObjectId;
};

export type CartType = ICart;
export type CartProduct = ICart['cart_products'][number];
export const CartModel = model<ICart>(DOCUMENT_NAME, cartSchema);
