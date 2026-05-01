import { type DiscountKeys, DiscountModel, type DiscountType } from '@/models/discount.model.js';
import { getSelectData } from '@/utils/index.js';
import type { QueryFilter, SortOrder } from 'mongoose';

export const checkDiscountExist = async ({
  filter,
  lean = true,
}: { filter?: QueryFilter<DiscountType>; lean?: boolean }) => {
  return await DiscountModel.findOne(filter).lean(lean);
};

export const findAllDiscountCodesSelect = async ({
  sort = 'ctime',
  filter = { isPublished: true },
  limit = 60,
  page = 1,
  select = ['discount_code', 'discount_name'],
}: {
  limit?: number;
  sort?: string;
  page?: number;
  filter?: QueryFilter<DiscountType>;
  select?: DiscountKeys[];
}) => {
  const skip = (page - 1) * limit;
  const query = { ...filter };
  const sortBy: Record<string, SortOrder> = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const discounts = await DiscountModel.find(query)
    .select(getSelectData(select, 1))
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .lean();

  const total = await DiscountModel.countDocuments(query);

  return { discounts, total };
};

export const findAllDiscountCodesUnSelect = async ({
  sort = 'ctime',
  filter = { isPublished: true },
  limit = 60,
  page = 1,
  unSelect = ['updatedAt', '_id'],
}: {
  limit?: number;
  sort?: string;
  page?: number;
  filter?: QueryFilter<DiscountType>;
  unSelect?: DiscountKeys[];
}) => {
  const skip = (page - 1) * limit;
  const query = { ...filter };
  const sortBy: Record<string, SortOrder> = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const discounts = await DiscountModel.find(query)
    .select(getSelectData(unSelect, 0))
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .lean();

  const total = await DiscountModel.countDocuments(query);

  return { discounts, total };
};
