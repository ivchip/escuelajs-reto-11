const joi = require('@hapi/joi');

const productIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const productTitleSchema = joi.string().max(80);
const productPriceSchema = joi.number();
const productImageSchema = joi.string().uri();
const productDescriptionSchema = joi.string().max(300);

const createProductSchema = {
  image: productImageSchema.required(),
  title: productTitleSchema.required(),
  price: productPriceSchema.required(),
  description: productDescriptionSchema.required()
};

const updateProductSchema = {
  image: productImageSchema,
  title: productTitleSchema,
  price: productPriceSchema,
  description: productDescriptionSchema
};

module.exports = {
  productIdSchema,
  createProductSchema,
  updateProductSchema
};
