const express = require("express");
const {
  registerStudent,
  loginStudent,
  editStudent,
  deleteStudent,
  listStudents,
} = require("../controller/studentController");

const studentRoute = express.Router();
studentRoute.post("/register", registerStudent);
studentRoute.post("/login", loginStudent);
studentRoute.delete("/delete/:id", deleteStudent);
studentRoute.put("/edit/:id", editStudent);
studentRoute.get("/list", listStudents);

module.exports = studentRoute;
