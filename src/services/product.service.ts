import { BadRequestError } from '@/core/error.response.js';
import {
  type ProductItem,
  type ProductType,
  clothingModel,
  electronicsModel,
  productModel,
} from '@/models/product.model.js';
import type { Types } from 'mongoose';

// Factory class to create products based on type
export class ProductFactory {
  static async createProduct({ type, payload }: { type: ProductType; payload: ProductItem }) {
    return new Clothing(payload).createProduct();
  }
}

// Base product class
class Product {
  product_name!: string;
  product_thumb!: string;
  product_description!: string;
  product_price!: number;
  product_quantity!: number;
  product_type!: 'Electronics' | 'Clothing' | 'Furniture';
  product_shop!: Types.ObjectId;
  product_attributes!: Record<string, any>;

  constructor(payload: ProductItem) {
    Object.assign(this, payload);
  }

  async createProduct({ product_shop }: { product_shop: Types.ObjectId }) {
    return productModel.create({ ...this, product_shop });
  }
}

// Clothing product class
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) {
      throw new BadRequestError('Failed to create clothing attributes');
    }

    const newProduct = await super.createProduct({ product_shop: newClothing._id });
    if (!newProduct) {
      throw new BadRequestError('Failed to create clothing product');
    }
    return newProduct;
  }
}

// Electronics product class
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronicsModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronics) {
      throw new BadRequestError('Failed to create electronics attributes');
    }

    const newProduct = await super.createProduct({ product_shop: newElectronics._id });
    if (!newProduct) {
      throw new BadRequestError('Failed to create electronics product');
    }
    return newProduct;
  }
}
