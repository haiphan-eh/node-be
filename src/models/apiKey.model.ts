import { type InferSchemaType, Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

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
      enum: PERMISSIONS,
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

const ApiKeyModel = model<IApiKey>(DOCUMENT_NAME, apiKeySchema);

export { ApiKeyModel, type IApiKey };
