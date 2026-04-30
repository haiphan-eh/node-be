import { BadRequestError } from '@/core/error.response.js';
import { productModel } from '@/models/product.model.js';

const queryProduct = async ({
  query,
  offset,
  limit,
}: { query: Record<string, any>; offset: number; limit: number }) => {
  return productModel
    .find(query)
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

export const publishProductByShop = async ({
  product_shop,
  productId,
}: {
  product_shop: string;
  productId: string;
}) => {
  const product = await productModel.findOne({ _id: productId, product_shop });
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
  const product = await productModel.findOne({ _id: productId, product_shop });
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
  const regexSearch = new RegExp(keySearch); // 'i' for case-insensitive

  /*  const results = await productModel.find({
    $or: [
      { product_name: regexSearch },
      { product_description: regexSearch },
    ],
    isPublished: true, // Only search in published products
  }).populate('product_shop', 'name email -_id'); // Populate shop info */

  /* const results = await productModel.find({
    $text: { $search: regexSearch },
    score: { $meta: 'textScore' }, // Add text score to results
    isPublished: true,
  }); */

  /*  const results = await productModel.find(
    {
      $text: { $search: regexSearch },
    },
    {
      score: { $meta: 'textScore' }, // Add text score to results
    },
    { isPublished: true },
  ).sort() */

  const results = await productModel
    .find({
      $text: { $search: regexSearch },
      isPublished: true,
    })
    .sort({
      score: { $meta: 'textScore' }, // Add text score to results
    });

  return results;
};
