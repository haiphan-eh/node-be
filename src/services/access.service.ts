import {
  createPublicKey,
  generateKeyPairSync,
  getRandomValues,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { createTokenPair } from '@/auth/authUtils.js';
import { AuthFailureError, BadRequestError } from '@/core/error.response.js';
import { shopModel } from '@/models/shop.model.js';
import { KeyTokenService, ShopService } from '@/services/index.js';
import { getInfoData } from '@/utils/index.js';

const passwordService = {
  hash: (password: string) => {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hashedPassword}`;
  },
  verify: (password: string, storedPassword: string) => {
    const [salt, hashedPassword] = storedPassword.split(':');
    const hashedBuffer = Buffer.from(hashedPassword, 'hex');
    const clearBuffer = scryptSync(password, salt, 64);
    return timingSafeEqual(hashedBuffer, clearBuffer);
  },
};

const token = () => ({
  privateKey: randomBytes(64).toString('hex'),
  publicKey: randomBytes(64).toString('hex'),
});

/* 
  1. check email
  2. match pw
  3. create accessToken and refreshToken
  4. generate tokens pair
  5. get data return  
*/

export const login = async ({
  email,
  password,
  refreshToken,
}: { email: string; password: string; refreshToken?: string }) => {
  const foundShop = await ShopService.findByEmail({ email });
  if (!foundShop) {
    throw new BadRequestError('Shop not registered!');
  }

  const { _id, password: hashedPassword } = getInfoData({ fields: ['_id', 'password'], object: foundShop });
  const userId = _id.toString();

  const isPasswordValid = passwordService.verify(password, hashedPassword);
  if (!isPasswordValid) {
    throw new AuthFailureError('Invalid password!');
  }

  const { privateKey, publicKey } = token();

  const tokens = await createTokenPair({
    payload: { userId, email },
    publicKey,
    privateKey,
  });

  if (!tokens) {
    throw new AuthFailureError('Token generation failed!');
  }

  const keyStore = await KeyTokenService.createKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken: tokens.refreshToken,
  });

  if (!keyStore) {
    throw new AuthFailureError('Error creating key token!');
  }

  return {
    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
    tokens,
  };
};

export const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  const holderShop = await shopModel.findOne({ email }).lean();
  if (holderShop) {
    throw new BadRequestError('Shop already registered!');
  }

  const hashedPassword = passwordService.hash(password);

  const newShop = await shopModel.create({ name, email, password: hashedPassword, roles: ['SHOP'] });

  if (newShop) {
    // create privateKey and publicKey for the shop
    /* V1: complex */
    /*       const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      }); */

    /* V2: simplified */
    const { privateKey, publicKey } = token();
    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id.toString(),
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      return {
        code: 500,
        message: 'Error creating key token!',
      };
    }

    const tokens = await createTokenPair({
      payload: { userId: newShop._id.toString(), email },
      publicKey,
      privateKey,
    });

    return {
      code: 201,
      metadata: {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
        tokens,
      },
    };
  }
  return {
    code: 201,
    message: 'Shop registered successfully!',
  };
};
