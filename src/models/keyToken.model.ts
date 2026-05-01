import { type InferSchemaType, Schema, type Types, model } from 'mongoose';
import { DOCUMENT_NAME as SHOP_MODEL } from './shop.model.js';

// Constants for the schema
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Define the schema
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: SHOP_MODEL,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String, // String to store the refresh token's using
      required: true,
    },
    refreshTokensUsed: {
      type: [String], // Array of strings to store used refresh tokens
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    collection: COLLECTION_NAME,
  },
);

// Interface for type safety
type IKeyToken = InferSchemaType<typeof schema> & {
  _id: Types.ObjectId;
};
// Create the model
const KeyTokenModel = model<IKeyToken>(DOCUMENT_NAME, schema);

export { KeyTokenModel, type IKeyToken };
