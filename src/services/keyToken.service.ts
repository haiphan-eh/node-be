import { KeyTokenModel } from '@/models/keyToken.model.js';

export const createKeyToken = async ({
  userId,
  publicKey,
  privateKey,
  refreshToken,
}: { userId: string; publicKey: string; privateKey: string; refreshToken?: string }) => {
  /*    const keyToken = await KeyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return keyToken ? keyToken : null; */

  const filter = { user: userId };
  const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
  const options = { upsert: true, new: true };

  return KeyTokenModel.findOneAndUpdate(filter, update, options);
};

export const findByUserId = async (userId: string) => {
  return KeyTokenModel.findOne({ user: userId });
};

export const deleteKeyByUserId = async (userId: string) => {
  return KeyTokenModel.deleteOne({ user: userId });
};

export const findByRefreshTokenUsed = async (refreshToken: string) => {
  return KeyTokenModel.findOne({ refreshTokensUsed: refreshToken });
};

export const findByRefreshToken = async (refreshToken: string) => {
  return KeyTokenModel.findOne({ refreshToken });
};

export const updateKeyTokenUsed = async ({
  newRefreshToken,
  usedRefreshToken,
}: { newRefreshToken: string; usedRefreshToken: string }) => {
  return KeyTokenModel.findOneAndUpdate(
    { refreshToken: usedRefreshToken },
    { $push: { refreshTokensUsed: usedRefreshToken }, $set: { refreshToken: newRefreshToken } },
    { new: true },
  );
};
