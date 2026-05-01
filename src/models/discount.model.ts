import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as SHOP_MODEL } from './shop.model.js';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      default: 'fixed_amount',
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    } /* ex: 10.000 or 10% */,
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    }, // Maximum number of times the discount can be used across all users
    discount_used_count: {
      type: Number,
      required: true,
    }, // How many times the discount has been used across all users
    discount_used_by: {
      type: Array,
      default: [],
    }, // Array of user IDs who have used the discount
    discount_max_use_per_user: {
      type: Number,
      required: true,
    }, // Maximum number of times a single user can use the discount
    discount_min_order_value: {
      type: Number,
      required: true,
    }, // Minimum order value required to apply the discount
    discount_max_value: {
      type: Number,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: SHOP_MODEL,
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    discount_applies_to: {
      type: String,
      enum: ['all_products', 'specific_products'],
      required: true,
    },
    discount_productIds: {
      type: Array,
      default: [],
    }, // Array of product IDs the discount applies to (if discount_applies_to is 'specific_products')
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// TODO: check
// discountSchema.index({ discount_shopId: 1, discount_code: 1 }, { unique: true });

// Interface for type safety
type IDiscount = InferSchemaType<typeof discountSchema> & {
  _id: Types.ObjectId;
};

const DiscountModel = model<IDiscount>(DOCUMENT_NAME, discountSchema);

export type DiscountType = IDiscount;
export type DiscountKeys = keyof IDiscount;
export { DiscountModel };
