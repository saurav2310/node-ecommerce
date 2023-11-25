const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const response = await product.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({deleted:{$ne:true}});
  let totalProducts = Product.find({deleted:{$ne:true}});
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProducts =totalProducts.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProducts = totalProducts.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProducts=totalProducts.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const totalDocs = await totalProducts.count().exec();

  try {
    const docs = await query.exec();
    res.set('X-Total-Count',totalDocs);
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchProductById = async (req,res)=>{
  const {id} = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
}

exports.updateProduct = async (req,res)=>{
  const {id} = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
    
  }
}