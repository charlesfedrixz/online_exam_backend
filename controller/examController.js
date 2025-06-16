const asyncHandler = require("express-async-handler");
const Exam = require("../models/examModel");
const Result = require("../models/resultModel");
const Student = require("../models/studentModel");

// @desc    Create a new exam
// @route   POST /api/exams
const createExam = asyncHandler(async (req, res) => {
  const { title, subject, duration, createdBy, scheduledAt, questions } =
    req.body;

  if (
    !title ||
    !duration ||
    !createdBy ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return res.status(400).json({ message: "Required fields missing." });
  }

  const exam = new Exam({
    title,
    subject,
    duration,
    createdBy,
    scheduledAt,
    questions,
  });

  const savedExam = await exam.save();
  res
    .status(201)
    .json({ message: "Exam created successfully", exam: savedExam });
});

// @desc    Delete an exam
// @route   DELETE /api/exams/:id
const deleteExam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exam = await Exam.findById(id);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found." });
  }

  await Exam.deleteOne({ _id: id });
  res.status(200).json({ message: "Exam deleted successfully." });
});

// @desc    Edit an exam
// @route   PUT /api/exams/:id
const editExam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, subject, duration, scheduledAt, questions } = req.body;

  const exam = await Exam.findById(id);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found." });
  }

  if (title !== undefined) exam.title = title;
  if (subject !== undefined) exam.subject = subject;
  if (duration !== undefined) exam.duration = duration;
  if (scheduledAt !== undefined) exam.scheduledAt = scheduledAt;
  if (questions !== undefined) exam.questions = questions;

  const updatedExam = await exam.save();
  res
    .status(200)
    .json({ message: "Exam updated successfully", exam: updatedExam });
});

// @desc    List all exams
// @route   GET /api/exams
const listExams = asyncHandler(async (req, res) => {
  const now = new Date();
  const exams = await Exam.find({ scheduledAt: { $gt: now } }).populate(
    "createdBy",
    "name email"
  );
  if (!exams || exams.length === 0) {
    return res.status(200).json({ message: "No exams found." });
  }
  res.status(200).json({ message: "exams listed successfully.", data: exams });
});

// @desc    Student submits exam answers
// @route   POST /api/exams/:examId/submit
const submitExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { studentId, answers } = req.body; // answers: [{ questionId, selectedAnswer }]
  console.log(
    "examId:",
    examId,
    "studentId:",
    studentId,
    "selectedAnswer:",
    answers
  );

  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found." });
  }

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  let score = 0;
  let totalMarks = 0;
  const answerResults = [];

  for (const q of exam.questions) {
    const submitted = answers.find((a) => a.questionId === q._id.toString());
    const isCorrect = submitted && submitted.selectedAnswer === q.correctAnswer;
    const awardedMarks = isCorrect ? q.marks : 0;

    if (submitted) {
      score += awardedMarks;
    }
    totalMarks += q.marks;

    answerResults.push({
      questionId: q._id,
      selectedAnswer: submitted ? submitted.selectedAnswer : null,
      correctAnswer: q.correctAnswer,
      isCorrect,
      marks: awardedMarks,
    });
  }

  const result = new Result({
    student: studentId,
    exam: examId,
    score,
    totalMarks,
    answers: answerResults,
  });

  await result.save();

  res.status(200).json({
    message: "Exam submitted successfully",
    score,
    totalMarks,
    resultId: result._id,
    answers: answerResults,
  });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { examId, questionId } = req.params;

  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const questionIndex = exam.questions.findIndex(
    (q) => q._id.toString() === questionId
  );

  if (questionIndex === -1) {
    return res.status(404).json({ message: "Question not found in this exam" });
  }

  // Remove the question from the array
  exam.questions.splice(questionIndex, 1);
  await exam.save();

  res.status(200).json({ message: "Question deleted successfully" });
});

// @desc    Show score with total mark after submitting student answer
// @route   GET /api/results/:resultId/score
const showScore = asyncHandler(async (req, res) => {
  const { resultId } = req.params;

  const result = await Result.findById(resultId)
    .populate("student", "name email")
    .populate("exam", "title subject questions");

  if (!result) {
    return res.status(404).json({ message: "Result not found." });
  }

  // Compare student answers with exam questions and correct answers
  const detailedAnswers = result.exam.questions.map((q) => {
    const studentAnswer = result.answers.find(
      (a) => a.questionId.toString() === q._id.toString()
    );
    return {
      questionText: q.questionText,
      options: q.options, // Changed from questionId to questionText
      selectedAnswer: studentAnswer ? studentAnswer.selectedAnswer : null,
      correctAnswer: q.correctAnswer,
      isCorrect:
        studentAnswer && studentAnswer.selectedAnswer === q.correctAnswer,
      marks: q.marks,
    };
  });

  res.status(200).json({
    student: result.student,
    exam: {
      _id: result.exam._id,
      title: result.exam.title,
      subject: result.exam.subject,
    },
    score: result.score,
    totalMarks: result.totalMarks,
    totalQuestions: result.exam.questions.length,
    answers: detailedAnswers,
  });
});

/**
 * @desc    List all submitted exam results by all students, grouped by exam
 * @route   GET /api/results
 */
const resultList = asyncHandler(async (req, res) => {
  // Fetch all results, populate student and exam info
  const results = await Result.find()
    .populate("student")
    .populate("exam", "title subject scheduledAt")
    .sort({ createdAt: -1 });
  console.log("result", results);
  if (!results || results.length === 0) {
    return res.status(200).json({ message: "No results found." });
  }

  // Group results by exam
  const grouped = {};
  results.forEach((result) => {
    const examId = result.exam._id.toString();
    if (!grouped[examId]) {
      grouped[examId] = {
        exam: result.exam,
        submissions: [],
      };
    }
    grouped[examId].submissions.push({
      resultId: result._id,
      student: {
        _id: result._id,
        studentName: result.student.studentName,
        studentID: result.student.studentID,
      },
      score: result.score,
      totalMarks: result.totalMarks,
      submittedAt: result.createdAt,
      answers: result.answers,
    });
  });

  res.status(200).json({ data: Object.values(grouped) });
});
module.exports = {
  createExam,
  deleteExam,
  editExam,
  listExams,
  submitExam,
  deleteQuestion,
  showScore, // <-- Export the new function
  resultList,
};
