const express = require("express");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const server = express();
const cors = require('cors')

server.use(cors({
  exposedHeaders:['X-Total-count']
}));
server.use(express.json()); // to parse json from req.body
server.use("/products", productRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}
server.get("/", (req, res) => {
  res.json({ status: "success" });
});

//Create product

server.listen(8080, () => {
  console.log("server started");
});
