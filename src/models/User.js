import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  video: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videos",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
