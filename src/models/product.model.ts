import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import slugify from 'slugify';
import { DOCUMENT_NAME as SHOP_MODEL } from './shop.model.js';

export const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL, required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    // more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      set: (val: number) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    product_variations: [
      {
        type: {
          type: Array,
          default: [],
        },
      },
    ],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

// create index for searching
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function () {
  this.product_slug = slugify(this.product_name, { lower: true });
});

// product type clothing
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL, required: true },
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
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL, required: true },
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
    product_shop: { type: Schema.Types.ObjectId, ref: SHOP_MODEL, required: true },
  },
  {
    collection: 'Furniture',
    timestamps: true,
  },
);

// Interface for type safety
type IProductBase<TAttributes> = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
  product_attributes: TAttributes;
};

type ClothingAttributes = InferSchemaType<typeof clothingSchema> & {
  _id: Types.ObjectId;
};
type ElectronicsAttributes = InferSchemaType<typeof electronicsSchema> & {
  _id: Types.ObjectId;
};
type FurnitureAttributes = InferSchemaType<typeof furnitureSchema> & {
  _id: Types.ObjectId;
};

type IClothing = IProductBase<ClothingAttributes>;
type IElectronic = IProductBase<ElectronicsAttributes>;
type IFurniture = IProductBase<FurnitureAttributes>;

export type ProductItem = IClothing | IElectronic | IFurniture;
export type ProductKeys = keyof ProductItem;
export type ProductType = ProductItem['product_type'];

// Create the model
export const productModel = model<ProductItem>(DOCUMENT_NAME, productSchema);
export const clothingModel = model<IClothing>('Clothing', clothingSchema);
export const electronicsModel = model<IElectronic>('Electronics', electronicsSchema);
export const furnitureModel = model<IFurniture>('Furniture', furnitureSchema);
