const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [0, "minimum price cannot be 0"],
    max: [100000, "Wrong maximum price"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [1, "discount cannot be 0%"],
    max: [99, "discount cannot be 100%"],
    required: true,
  },
  rating: {
    type: Number,
    min: [0, "Wrong min rating"],
    max: [5, "Wrong max rating"],
    default: 0,
    required: true,
  },
  stock: {
    type: Number,
    min: [0, "Wrong min stock"],
    default: 0,
    required: true,
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual('id');

virtual.get(function () {
  return this._id;
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {delete ret._id},
});

exports.Product = mongoose.model("Product", productSchema);
