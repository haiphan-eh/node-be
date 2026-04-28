import { apiKeyModel } from '@/models/apiKey.model.js';

export const findById = async (key: string) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

export const createKey = async ({ key, permissions }: { key: string; permissions: string[] }) => {
  const newKey = await apiKeyModel.create({ key, permissions });
  return newKey;
};
