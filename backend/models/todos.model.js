import mongoose from "mongoose";
const { Schema } = mongoose;
const toDoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  endDate: {
    type: Object,
    default: () => {
      const d = new Date();
      d.setHours(23, 59, 59);
      return d;
    },
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Object,
    default: () => new Date(),
  },
});
export default mongoose.model("todo", toDoSchema);
