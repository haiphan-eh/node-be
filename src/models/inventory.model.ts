import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as PRODUCT_MODEL } from './product.model.js';
import { DOCUMENT_NAME as SHOP_MODEL } from './shop.model.js';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    inventory_productId: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT_MODEL,
    },
    inventory_location: {
      type: String,
      default: 'Unknown',
    },
    inventory_stock: {
      type: Number,
      required: true,
    },
    inventory_shopId: {
      type: Schema.Types.ObjectId,
      ref: SHOP_MODEL,
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

type IInventory = InferSchemaType<typeof inventorySchema> & {
  _id: Types.ObjectId;
};

const InventoryModel = model<IInventory>(DOCUMENT_NAME, inventorySchema);

export { InventoryModel };
