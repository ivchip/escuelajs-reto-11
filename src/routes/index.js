const express = require('express');
const path = require('path');
const passport = require('passport');
const ProductService = require('../services/index');
const receipt = '../assets/receipt.pdf';

const {
  productIdSchema,
  createProductSchema,
  updateProductSchema
} = require('../utils/schemas/products');

const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');

// JWT strategy
require('../utils/auth/strategies/jwt');

const platziStore = app => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get(
    '/products',
    async (req, res, next) => {
      const { tags } = req.query;
      try {
        const products = await productService.getProducts({ tags });
        res.status(200).json({
          data: products,
          message: 'Products listed'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/products/:id',
    validationHandler({ id: productIdSchema }, 'params'),
    async (req, res, next) => {
      const { id } = req.params;
      try {
        const product = await productService.getProductById(id);
        res.status(200).json({
          data: product,
          message: 'Product retrieved'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/products',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:product']),
    validationHandler(createProductSchema),
    async (req, res, next) => {
      const { body: product } = req;
      try {
        const createProduct = await productService.createProduct({
          ...product
        });
        res.status(201).json({
          data: createProduct,
          message: 'Product created'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/products/:id',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:product']),
    validationHandler({ id: productIdSchema }, 'params'),
    validationHandler(updateProductSchema),
    async (req, res, next) => {
      const { id } = req.params;
      const { body: product } = req;
      try {
        const updateProduct = await productService.updateProductById({
          id,
          ...product
        });
        res.status(200).json({
          data: updateProduct,
          message: 'Product updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete('/products/:id',
  passport.authenticate('jwt', { session: false }),
  scopesValidationHandler(['delete:product']),
  validationHandler({ id: productIdSchema }, 'params'),  
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleteProduct = await productService.deleteProductById(id);
      res.status(200).json({
        data: deleteProduct,
        message: 'Product deleted'
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
};

module.exports = platziStore;
