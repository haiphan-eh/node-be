import { BadRequestError } from '@/core/error.response.js';
import { ProductModel } from '@/models/product.model.js';
import type { Model, SortOrder } from 'mongoose';

const queryProduct = async ({
  query,
  offset,
  limit,
}: { query: Record<string, any>; offset: number; limit: number }) => {
  return ProductModel.find(query)
    .populate('product_shop', 'name email -_id') // select [name, email] from Shop collection
    .skip(offset)
    .limit(limit)
    .sort({ updatedAt: -1 });
};

export const findAllDraftsForShop = async ({
  query,
  offset = 0,
  limit = 60,
}: { query: Record<string, any>; offset?: number; limit?: number }) => {
  return queryProduct({ query, offset, limit });
};

export const findAllPublishedForShop = async ({
  query,
  offset = 0,
  limit = 60,
}: { query: Record<string, any>; offset?: number; limit?: number }) => {
  return queryProduct({ query, offset, limit });
};

export const findAllProducts = async ({
  sort,
  filter,
  limit,
  page,
  select,
}: { limit: number; sort: string; page: number; filter: Record<string, any>; select: Record<string, any> }) => {
  const skip = (page - 1) * limit;
  const query = { ...filter };
  const sortBy: Record<string, SortOrder> = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const products = await ProductModel.find(query).select(select).skip(skip).limit(limit).sort(sortBy).lean();

  const total = await ProductModel.countDocuments(query);

  return { products, total };
};

export const findProduct = async ({ product_id, unSelect }: { product_id: string; unSelect: Record<string, any> }) => {
  return ProductModel.findById(product_id).select(unSelect) ?? {};
};

export const updateProductById = async ({
  productId,
  product_shop,
  payload,
  isNew,
  model,
}: { productId: string; product_shop: string; payload: Record<string, any>; isNew: boolean; model: Model<any> }) => {
  return model.findByIdAndUpdate({ _id: productId, product_shop }, payload, { new: isNew });
};

export const publishProductByShop = async ({
  product_shop,
  productId,
}: {
  product_shop: string;
  productId: string;
}) => {
  const product = await ProductModel.findOne({ _id: productId, product_shop });
  if (!product) {
    throw new BadRequestError('Product not found');
  }
  product.isDraft = false;
  product.isPublished = true;
  return product.save();
};

export const unpublishProductByShop = async ({
  product_shop,
  productId,
}: {
  product_shop: string;
  productId: string;
}) => {
  const product = await ProductModel.findOne({ _id: productId, product_shop });
  if (!product) {
    throw new BadRequestError('Product not found');
  }
  product.isDraft = true;
  product.isPublished = false;
  return product.save();
};

export const searchProductByUser = async ({
  keySearch,
}: {
  keySearch: string;
  limit?: number;
  offset?: number;
}) => {
  /*  const results = await ProductModel.find({
    $or: [
      { product_name: regexSearch },
      { product_description: regexSearch },
    ],
    isPublished: true, // Only search in published products
  }).populate('product_shop', 'name email -_id'); // Populate shop info */

  /* const results = await ProductModel.find({
    $text: { $search: regexSearch },
    score: { $meta: 'textScore' }, // Add text score to results
    isPublished: true,
  }); */

  /*  const results = await ProductModel.find(
    {
      $text: { $search: regexSearch },
    },
    {
      score: { $meta: 'textScore' }, // Add text score to results
    },
    { isPublished: true },
  ).sort() */

  const results = await ProductModel.find({
    $text: { $search: keySearch },
    isPublished: true,
  }).sort({
    score: { $meta: 'textScore' }, // Add text score to results
  });

  return results;
};
