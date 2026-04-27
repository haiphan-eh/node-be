import { keyTokenModel } from '@/models/keyToken.model.js';

export const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
}: { userId: string; publicKey: string; privateKey: string }) => {
  try {
    const keyToken = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return keyToken ? keyToken : null;
  } catch (error) {
    console.error('Error creating/updating key token:', error);
    return null;
  }
};
