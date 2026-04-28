import { type InferSchemaType, Schema, type Types, model } from 'mongoose';

// Constants for the schema
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Define the schema
/* const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: [String], // Array of strings to store used refresh tokens
      default: [],
    },
    refreshToken: {
      type: String, // String to store the refresh token's using
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    collection: COLLECTION_NAME,
  },
);
 */

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
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
  _id: Types.ObjectId; // Adding _id field to the interface
};
// Create the model
const keyTokenModel = model<InferSchemaType<typeof schema>>(DOCUMENT_NAME, schema);

export { keyTokenModel, type IKeyToken };
