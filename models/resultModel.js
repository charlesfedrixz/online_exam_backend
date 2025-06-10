const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  answers: [
    {
      questionId: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      marks: Number,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
