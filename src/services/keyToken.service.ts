import { keyTokenModel } from '@/models/keyToken.model.js';

export const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}: { userId: string; publicKey: string; privateKey: string; refreshToken?: string }) => {
  try {
    /*    const keyToken = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return keyToken ? keyToken : null; */

    const filter = { user: userId };
    const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
    const options = { upsert: true, new: true };

    const keyToken = await keyTokenModel.findOneAndUpdate(filter, update, options);
    return keyToken ? keyToken : null;
  } catch (error) {
    console.error('Error creating/updating key token:', error);
    return null;
  }
};
