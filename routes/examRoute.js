const express = require("express");
const examRoute = express.Router();
const {
  createExam,
  deleteExam,
  editExam,
  listExams,
  submitExam,
  deleteQuestion,
  showScore,
} = require("../controller/examController");

examRoute.post("/create", createExam);
examRoute.get("/list", listExams);
examRoute.put("/edit/:id", editExam);
examRoute.delete("/delete/:id", deleteExam);
examRoute.post("/submit/:examId", submitExam);
examRoute.delete("/delete/:examId/:questionId", deleteQuestion);
examRoute.get("/score/:resultId", showScore);

module.exports = examRoute;
