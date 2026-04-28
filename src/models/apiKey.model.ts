import { type InferSchemaType, Schema, model } from 'mongoose';
const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

const PERMISSIONS = ['0000', '1111', '2222'] as const;
type Permission = (typeof PERMISSIONS)[number];

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// Interface for type safety
type IApiKey = InferSchemaType<typeof apiKeySchema> & {
  permissions: Permission[];
};

const apiKeyModel = model<IApiKey>(DOCUMENT_NAME, apiKeySchema);

export { apiKeyModel, type IApiKey };
