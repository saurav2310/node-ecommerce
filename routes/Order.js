const express = require("express");
const {
  fetchOrderByUser,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchAllOrders,
} = require("../controller/Order");
const router = express.Router();

router
  .post("/", createOrder)
  .get("/user/:userId", fetchOrderByUser)
  .get("/", fetchAllOrders)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder);

exports.router = router;
