const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://vanshajjyadava_namasteDev:MpEub7fUabj8Yn9u@namastenode.rycanmv.mongodb.net/devTinder"
  );
};

module.exports = connectDb;
