const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    marks: { type: Number, default: 1 },
  }
  // { _id: false }
); // Prevents automatic _id for subdocuments

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String },
    duration: { type: Number }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    scheduledAt: { type: Date },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
