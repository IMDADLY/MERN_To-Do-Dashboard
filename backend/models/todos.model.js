import mongoose from "mongoose";
const { Schema } = mongoose;
const toDoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    immutable: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Object,
    default: () => new Date(),
    immutable: true,
  },
});
export default mongoose.model("todo", toDoSchema);
