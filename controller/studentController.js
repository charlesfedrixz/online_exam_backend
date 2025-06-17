const Student = require("../models/studentModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Register a new student
const registerStudent = asyncHandler(async (req, res) => {
  const { studentID, studentName, course, email } = req.body;
  console.log(studentID, studentName, course, email);
  if (!studentID || !studentName || !course || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingStudent = await Student.findOne({ studentID });
  if (existingStudent) {
    return res.status(409).json({ message: "Student already registered." });
  }

  const student = new Student({ studentID, studentName, course, email });
  await student.save();

  res.status(201).json({
    message: "Student registered successfully.",
    student,
  });
});

// Login student
const loginStudent = asyncHandler(async (req, res) => {
  const { studentID, studentName } = req.body;

  if (!studentID || !studentName) {
    return res
      .status(400)
      .json({ message: "Student ID and Student Name are required." });
  }

  const student = await Student.findOne({ studentID, studentName });
  if (!student) {
    return res
      .status(401)
      .json({ message: "Invalid credentials.", data: student });
  }

  // Set active to true when student logs in
  student.active = true;
  await student.save();

  res.status(200).json({
    message: "Login successful.",
    student: {
      id: student._id,
      studentID: student.studentID,
      studentName: student.studentName,
      active: student.active,
      // Add other fields here if needed (email, class, etc.)
    },
  });
});

const logoutStudent = asyncHandler(async (req, res) => {
  // If using sessions or JWT, you would destroy the session or invalidate the token here.
  // For stateless login (like your current implementation), just send a response.
  res.status(200).json({ message: "Logout successful." });
});

// Edit student
const editStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStudentID, newStudentName, newEmail, newCourse } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid student ID format." });
  }
  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  if (newStudentID) student.studentID = newStudentID;
  if (newStudentName) student.studentName = newStudentName;
  if (newEmail) student.email = newEmail;
  if (newCourse) student.course = newCourse;

  await student.save();

  res.status(200).json({
    message: "Student updated successfully.",
    student,
  });
});

// Delete student
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid student ID format." });
  }
  const student = await Student.findById(id);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }
  await student.deleteOne();

  res.status(200).json({ message: "Student deleted successfully." });
});

const listStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({});
  if (students.length === 0) {
    return res.status(200).json({ message: "No students found." });
  }
  res.status(200).json({ students });
});

module.exports = {
  registerStudent,
  loginStudent,
  editStudent,
  deleteStudent,
  listStudents,
};
