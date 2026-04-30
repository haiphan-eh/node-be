import { BadRequestError } from '@/core/error.response.js';
import {
  type IProduct,
  type ProductItem,
  type ProductType,
  clothingModel,
  electronicsModel,
  furnitureModel,
  productModel,
} from '@/models/product.model.js';
import { ProductRepository } from '@/services/repositories/index.js';
import { getSelectData } from '@/utils/index.js';
import type { Types } from 'mongoose';

type ProductConstructor = new (payload: ProductItem) => Product;

// Factory class to create products based on type
export class ProductFactory {
  private static productRegistry: Record<string, ProductConstructor> = {};
  static registerProductType(type: ProductType, productClass: ProductConstructor) {
    ProductFactory.productRegistry[type] = productClass;
  }

  static async createProduct({ type, payload }: { type: ProductType; payload: ProductItem }) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass) {
      throw new BadRequestError(`Unsupported product type: ${type}`);
    }

    return new productClass(payload).createProduct();
  }

  static async searchProductByUser({
    keySearch,
    limit = 60,
    offset = 0,
  }: { keySearch: string; limit?: number; offset?: number }) {
    return ProductRepository.searchProductByUser({ keySearch, limit, offset });
  }

  static async publishProductByShop({ product_shop, productId }: { product_shop: string; productId: string }) {
    return ProductRepository.publishProductByShop({
      product_shop,
      productId,
    });
  }

  static async unpublishProductByShop({ product_shop, productId }: { product_shop: string; productId: string }) {
    return ProductRepository.unpublishProductByShop({
      product_shop,
      productId,
    });
  }

  static async findAllDraftsForShop({
    product_shop,
    limit = 60,
    offset = 0,
  }: { product_shop: string; limit?: number; offset?: number }) {
    const query = { product_shop, isDraft: true };
    return ProductRepository.findAllDraftsForShop({ query, limit, offset });
  }

  static async findAllPublishedForShop({
    product_shop,
    limit = 60,
    offset = 0,
  }: { product_shop: string; limit?: number; offset?: number }) {
    const query = { product_shop, isDraft: false };
    return ProductRepository.findAllPublishedForShop({ query, limit, offset });
  }

  static async findAllProducts({
    sort = 'ctime',
    filter = { isPublished: true },
    limit = 60,
    page = 1,
    select = ['product_name', 'product_price', 'product_thumb', 'product_shop'],
  }: { limit?: number; sort?: string; page?: number; filter?: Record<string, any>; select?: (keyof IProduct)[] }) {
    return ProductRepository.findAllProducts({ filter, page, select: getSelectData(select), limit, sort });
  }

  static async findProduct({ product_id, unSelect = ['_id'] }: { product_id: string; unSelect?: (keyof IProduct)[] }) {
    return ProductRepository.findProduct({ product_id, unSelect: getSelectData(unSelect, 0) });
  }
}

// Base product class
class Product {
  product_name!: string;
  product_thumb!: string;
  product_description!: string;
  product_price!: number;
  product_quantity!: number;
  product_type!: ProductType;
  product_shop!: Types.ObjectId;
  product_attributes!: Record<string, any>;

  constructor(payload: ProductItem) {
    Object.assign(this, payload);
  }

  async createProduct({ product_shop }: { product_shop?: Types.ObjectId } = {}) {
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

    const newProduct = await super.createProduct({ product_shop: newClothing.product_shop });
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

    const newProduct = await super.createProduct({ product_shop: newElectronics.product_shop });
    if (!newProduct) {
      throw new BadRequestError('Failed to create electronics product');
    }
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) {
      throw new BadRequestError('Failed to create furniture attributes');
    }

    const newProduct = await super.createProduct({ product_shop: newFurniture.product_shop });
    if (!newProduct) {
      throw new BadRequestError('Failed to create furniture product');
    }
    return newProduct;
  }
}

// Register product types in the factory
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);
