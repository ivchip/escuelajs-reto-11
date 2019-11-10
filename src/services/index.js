const MongoConnect = require('../lib/mongo');

class ProductService {
  constructor() {
    this.mongodb = new MongoConnect()
    this.collection = 'products'
  }

  async getProducts({ tags }) {
    try {
      const query = tags && { tags: { $in: tags } };
      const products = await this.mongodb.getAll(this.collection, query);
      return products || [];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(id) {
    try {
      const product = await this.mongodb.get(this.collection, id);
      return product || {};
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductById({ id, ...data }) {
    try {
      const productId = await this.mongodb.update(this.collection, id, data);
      return productId;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductById(id) {
    try {
      const productId = await this.mongodb.delete(this.collection, id);
      return productId;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createProduct(product) {
    try {
      const productId = await this.mongodb.create(this.collection, product);
      return productId;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ProductService;
