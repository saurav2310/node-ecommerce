const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");
const router = express.Router();

// /products is already added as base URL path
router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch('/:id',updateProduct);

exports.router = router;
