import { type Document, Schema, model } from 'mongoose';

// Constants for the schema
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

// Interface for type safety
interface IShop extends Document {
  name: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
  verify: boolean;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const shopSchema = new Schema<IShop>(
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

// Create the model
const shopModel = model<IShop>(DOCUMENT_NAME, shopSchema);

export { type IShop, shopModel };
