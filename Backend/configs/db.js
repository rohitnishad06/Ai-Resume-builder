const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("mongoDB Connected");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = dbConnect;
