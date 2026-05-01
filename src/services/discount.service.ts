/* 
    Discount Service
    1. Generate discount code [Shop | Admin]
    2. Get all discount codes with products [User | Shop]
    3. Get discount amount [User]
    5. Delete discount code [Shop | Admin]
    6. Cancel discount code [User]
*/

import { BadRequestError } from '@/core/error.response.js';
import { DiscountModel } from '@/models/discount.model.js';
import type { ProductItem } from '@/models/product.model.js';
import { DiscountRepository } from '@/models/repositories/index.js';
import { ProductService } from '@/services/index.js';

type DiscountItem = {
  code: string;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed_amount';
  isActive: boolean;
  shopId: string;
  minOrderValue: number;
  description: string;
  value: number;
  appliesTo: 'all_products' | 'specific_products';
  name: string;
  maxUses: number;
  maxUsesPerUser: number;
  productIds?: string[]; // Optional: Array of product IDs the discount applies to (if appliesTo is 'specific_products')
  maxValue?: number; // Optional: Maximum discount value for percentage type
  useCount?: number; // Optional: Number of times the code has been used
};

export const createDiscountCode = async (payload: DiscountItem) => {
  const {
    startDate,
    endDate,
    code,
    shopId,
    appliesTo,
    description,
    isActive,
    maxUses,
    maxUsesPerUser,
    productIds,
    minOrderValue,
    name,
    useCount,
    maxValue,
    type,
    value,
  } = payload;

  // 1. Validate: date range
  const today = new Date();
  if (startDate < today || endDate < today || endDate <= startDate) {
    throw new BadRequestError('Invalid discount code dates');
  }

  // 2. Check if code already exists
  const foundDiscount = await DiscountRepository.checkDiscountExist({
    filter: { discount_code: code, discount_shopId: shopId },
  });

  if (foundDiscount?.discount_is_active) {
    throw new BadRequestError('Discount code already exists');
  }

  // 3. Create the discount code
  const discount = new DiscountModel({
    discount_name: name,
    discount_description: description,
    discount_type: type,
    discount_value: value,
    discount_code: code,
    discount_start_date: startDate,
    discount_end_date: endDate,
    discount_max_uses: maxUses,
    discount_max_value: maxValue,
    discount_used_count: useCount || 0,
    discount_used_by: [],
    discount_max_use_per_user: maxUsesPerUser,
    discount_min_order_value: minOrderValue,
    discount_shopId: shopId,
    discount_is_active: isActive,
    discount_applies_to: appliesTo,
    discount_productIds: appliesTo === 'specific_products' ? productIds : [],
  });

  await discount.save();
  return discount;
};

export const getAllDiscountCodesWithProductsByUser = async ({
  code,
  shopId,
  limit,
  page,
  userId, // for logged in user
}: { code: string; shopId: string; userId?: string; limit?: number; page?: number }) => {
  const foundDiscount = await DiscountRepository.checkDiscountExist({
    filter: { discount_code: code, discount_shopId: shopId },
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new BadRequestError('Discount code not found or inactive');
  }

  const {
    discount_code,
    discount_name,
    discount_shopId,
    discount_applies_to,
    discount_productIds,
    discount_value,
    discount_type,
  } = foundDiscount;

  const products: ProductItem[] = [];

  if (discount_applies_to === 'specific_products') {
    // Get specific products
    const result = await ProductService.findAllProducts({
      limit,
      page,
      filter: {
        _id: { $in: discount_productIds },
        isPublished: true,
      },
      select: ['product_name'],
    });
    products.push(...result.products);
  }

  if (discount_applies_to === 'all_products') {
    // Get all products for the shop
    const result = await ProductService.findAllProducts({
      limit,
      page,
      filter: {
        // product_shop: shopId,
        isPublished: true,
      },
      select: ['product_name'],
    });
    products.push(...result.products);
  }

  return {
    discount: {
      discount_code,
      discount_name,
      discount_shopId,
      discount_applies_to,
      discount_productIds,
      discount_type,
      discount_value,
    },
    products,
  };
};

export const getAllDiscountCodesByShop = async ({
  shopId,
  limit,
  page,
}: { shopId: string; limit?: number; page?: number }) => {
  const discounts = await DiscountRepository.findAllDiscountCodesSelect({
    limit,
    page,
    filter: {
      discount_shopId: shopId,
    },
    select: [
      'discount_name',
      'discount_code',
      'discount_type',
      'discount_value',
      'discount_applies_to',
      'discount_productIds',
    ],
  });

  return discounts;
};

/* Apply discount code */
export const getDiscountAmount = async ({
  code,
  shopId,
  userId,
  products,
}: {
  code: string;
  shopId: string;
  userId?: string;
  products: ProductItem[];
}) => {
  const foundDiscount = await DiscountRepository.checkDiscountExist({
    filter: { discount_code: code, discount_shopId: shopId },
  });

  if (!foundDiscount) {
    throw new BadRequestError('Discount code not found');
  }

  const {
    discount_is_active,
    discount_max_uses,
    discount_start_date,
    discount_end_date,
    discount_code,
    discount_min_order_value,
    discount_max_use_per_user,
    discount_used_by,
    discount_type,
    discount_value,
    discount_applies_to,
    discount_productIds,
  } = foundDiscount;
  const today = new Date();

  if (!discount_is_active) throw new BadRequestError('Discount code is inactive');
  if (discount_max_uses <= 0) throw new BadRequestError('Discount code has reached its maximum uses');

  if (discount_start_date > today || discount_end_date < today || discount_end_date <= discount_start_date) {
    throw new BadRequestError('Invalid discount code dates');
  }

  if (userId && discount_max_use_per_user > 0) {
    const userUseCount = discount_used_by.filter((id) => id.toString() === userId).length;
    if (userUseCount >= discount_max_use_per_user) {
      throw new BadRequestError('You have reached the maximum uses for this discount code');
    }
  }

  // filter products if discount applies to specific products
  const applicableProducts =
    discount_applies_to === 'specific_products'
      ? products.filter((product) => discount_productIds.includes(product._id))
      : products;

  const orderValue = applicableProducts.reduce(
    (total, product) => total + product.product_price * product.product_quantity,
    0,
  );

  if (orderValue < discount_min_order_value) {
    throw new BadRequestError(
      `Minimum order value for this discount code: ${discount_code} is ${discount_min_order_value}`,
    );
  }

  const amount = discount_type === 'fixed_amount' ? discount_value : Math.round((orderValue * discount_value) / 100);
  return {
    totalOrder: orderValue,
    discountAmount: amount,
    totalAfterDiscount: orderValue - amount,
    discountDetail: applicableProducts.map((product) => ({
      productId: product._id,
      productName: product.product_name,
      quantity: product.product_quantity,
      price: product.product_price,
      totalPrice: product.product_price * product.product_quantity,
      discountAmount:
        discount_type === 'fixed_amount'
          ? Math.round(product.product_price * product.product_quantity - discount_value)
          : Math.round((product.product_price * product.product_quantity * discount_value) / 100),
    })),
  };
};

export const deleteDiscountCode = async ({ code, shopId }: { code: string; shopId: string }) => {
  const foundDiscount = await DiscountRepository.checkDiscountExist({
    filter: { discount_code: code, discount_shopId: shopId },
  });

  if (!foundDiscount) {
    throw new BadRequestError('Discount code not found');
  }

  await DiscountModel.deleteOne({ _id: foundDiscount._id });
  return { message: 'Discount code deleted successfully' };
};

export const cancelDiscountCode = async ({
  code,
  shopId,
  userId,
}: { code: string; shopId: string; userId: string }) => {
  const foundDiscount = await DiscountRepository.checkDiscountExist({
    filter: { discount_code: code, discount_shopId: shopId },
  });

  if (!foundDiscount) {
    throw new BadRequestError('Discount code not found');
  }

  const { discount_used_by } = foundDiscount;

  if (!discount_used_by.includes(userId)) {
    throw new BadRequestError('You have not used this discount code');
  }

  // Remove user from discount_used_by and decrement discount_used_count
  await DiscountModel.updateOne(
    { _id: foundDiscount._id },
    {
      $pull: { discount_used_by: userId },
      $inc: { discount_max_uses: 1, discount_used_count: -1 },
    },
  );

  return { message: 'Discount code usage cancelled successfully' };
};
