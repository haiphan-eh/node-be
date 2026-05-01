import { ApiKeyModel } from '@/models/apiKey.model.js';

export const findById = async (key: string) => {
  const objKey = await ApiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

export const createKey = async ({ key, permissions }: { key: string; permissions: string[] }) => {
  const newKey = await ApiKeyModel.create({ key, permissions });
  return newKey;
};
