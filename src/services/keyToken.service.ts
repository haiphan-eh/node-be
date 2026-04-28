import { keyTokenModel } from '@/models/keyToken.model.js';

export const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}: { userId: string; publicKey: string; privateKey: string; refreshToken?: string }) => {
  /*    const keyToken = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return keyToken ? keyToken : null; */

  const filter = { user: userId };
  const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
  const options = { upsert: true, new: true };

  return keyTokenModel.findOneAndUpdate(filter, update, options);
};

export const findByUserId = async (userId: string) => {
  return keyTokenModel.findOne({ user: userId });
};

export const deleteKeyByUserId = async (userId: string) => {
  return keyTokenModel.deleteOne({ user: userId });
};

export const findByRefreshTokenUsed = async (refreshToken: string) => {
  return keyTokenModel.findOne({ refreshTokensUsed: refreshToken });
};

export const findByRefreshToken = async (refreshToken: string) => {
  return keyTokenModel.findOne({ refreshToken });
};

export const updateKeyTokenUsed = async ({
  newRefreshToken,
  usedRefreshToken,
}: { newRefreshToken: string; usedRefreshToken: string }) => {
  return keyTokenModel.findOneAndUpdate(
    { refreshToken: usedRefreshToken },
    { $push: { refreshTokensUsed: usedRefreshToken }, $set: { refreshToken: newRefreshToken } },
    { new: true },
  );
};
