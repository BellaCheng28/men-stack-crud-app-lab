// models/food.js
const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
  name: String,
  like: Boolean,
});
const Food = mongoose.model('Food',foodSchema); //creat model
module.exports = Food;
