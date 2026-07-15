import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import isEmail from "validator/lib/isEmail.js";
const { Schema } = mongoose;
const userSchema = new Schema({
  user: {
    type: String,
    immutable: true,
    unique: true,
    required: true,
    minLength: 6,
  },
  passwordHash: {
    type: String,
    immutable: true,
    required: true,
  },
  email: {
    type: String,
    immutable: true,
    required: true,
    validate: [isEmail, "invalid email"],
    unique: true,
  },
});
userSchema.plugin(uniqueValidator);
export default mongoose.model("user", userSchema);
