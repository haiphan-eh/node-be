import { InventoryService } from '@/services/index.js';
import { createClient } from 'redis';

const redisClient = createClient({});

// Connect to Redis
redisClient.connect().catch(console.error);

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
    const result = await redisClient.setNX(key, '1');
    console.log(' result:::', result);
    if (result) {
      const isReservation = await InventoryService.reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await redisClient.pExpire(key, expireTime);
        return key;
      }
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

export const releaseLock = async (keyLock: string) => {
  return await redisClient.del(keyLock);
};
