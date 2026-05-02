import { promisify } from 'node:util';
import { InventoryService } from '@/services/index.js';
import redis from 'redis';
const redisClient = redis.createClient({});

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

export const acquireLock = async ({
  productId,
  quantity,
  cartId,
}: {
  productId: string;
  quantity: number;
  cartId: string;
}) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds
  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log(' result:::', result);
    if (result === 1) {
      const isReservation = await InventoryService.reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

export const releaseLock = async (keyLock: string) => {
  const delAsync = promisify(redisClient.del).bind(redisClient);
  return await delAsync(keyLock);
};
