const mongooose = require("mongoose");

const connectDb = async (connection) => {
  try {
    await mongooose.connect(connection, {});
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
 