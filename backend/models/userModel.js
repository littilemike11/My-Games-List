import mongoose from "mongoose";
//create a new mongoose model
const userSchema = new mongoose.Schema({
  username: {
    type: String, //datatype
    required: true, // optional
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  // save array
  //   messages: [string],
  // save other schemas, can be get id vs whole object
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
const User = mongoose.model("User", userSchema);

export default User;
