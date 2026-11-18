const mongoose = require("mongoose");

function connectDB() {
  return mongoose.connect("mongodb://127.0.0.1:27017/FoodSave");
}

module.exports = connectDB;
