const mongoose=require("mongoose");

const connectDB=async()=>{
await mongoose.connect("mongodb+srv://debalinalaha13:FHEwnTmL4HugKloY@clusternode.n9qdk.mongodb.net/NamasteNode");

};

module.exports=connectDB;
