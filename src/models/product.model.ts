import { type InferSchemaType, type ObjectId, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as SHOP_MODEL } from './shop.model.js';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

// product type clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL },
  },
  {
    collection: 'Clothes',
    timestamps: true,
  },
);

// product type electronics
const electronicsSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL },
  },
  {
    collection: 'Electronics',
    timestamps: true,
  },
);

// product type furniture
const furnitureSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL },
  },
  {
    collection: 'Furniture',
    timestamps: true,
  },
);

// Interface for type safety
type IProduct = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};
type IClothing = InferSchemaType<typeof clothingSchema> & {
  _id: Types.ObjectId;
};
type IElectronic = InferSchemaType<typeof electronicsSchema> & {
  _id: Types.ObjectId;
};
type IFurniture = InferSchemaType<typeof furnitureSchema> & {
  _id: Types.ObjectId;
};

export type ProductItem = IProduct | IClothing | IElectronic | IFurniture;

export type ProductType = IProduct['product_type'];
// Create the model
export const productModel = model<IProduct>(DOCUMENT_NAME, productSchema);
export const clothingModel = model<IClothing>('Clothing', clothingSchema);
export const electronicsModel = model<IElectronic>('Electronics', electronicsSchema);
export const furnitureModel = model<IFurniture>('Furniture', furnitureSchema);
