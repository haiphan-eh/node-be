import { type Document, type InferSchemaType, Schema, type Types, model } from 'mongoose';

// Constants for the schema
export const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Define the schema
const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      required: [true, 'Shop name is required'],
    },
    email: {
      type: String,
      unique: true,
      maxLength: 150,
      required: [true, 'Email is required'],
      match: [/\S+@\S+\.\S+/, 'Email is invalid'], // Email validation
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String], // Specify array of strings
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: COLLECTION_NAME,
  },
);

type IShop = InferSchemaType<typeof shopSchema> & {
  _id: Types.ObjectId;
};

const ShopModel = model<IShop>(DOCUMENT_NAME, shopSchema);

export { ShopModel };
