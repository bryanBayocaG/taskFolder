import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // const connect = await mongoose.connect(`${process.env.MONG_URI}`);
    const connect = await mongoose.connect(
      "mongodb+srv://bryanbayoca686:cuCumHkaItrUPa1U@taskfoldercluster.qvfa7.mongodb.net/?retryWrites=true&w=majority&appName=taskFolderCluster"
    );
    console.log(
      "DB connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectDB;
