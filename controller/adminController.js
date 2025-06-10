const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
//const Exam = require("../models/exam"); // Adjust path as needed
//const StudentExam = require("../models/studentExam"); // Adjust path/model as needed

// Register a new teacher
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, role, admincode } = req.body;
  if (!username || !email || !role || !admincode) {
    return res
      .status(400)
      .json({ message: "Username, email, role, and admincode are required" });
  }
  if (role !== "teacher" && role !== "superAdmin") {
    return res
      .status(400)
      .json({ message: "Role must be either 'teacher' or 'superadmin'" });
  }
  const existingTeacher = await Admin.findOne({ email });
  if (existingTeacher) {
    return res.status(409).json({ message: "This email already exists" });
  }
  const newTeacher = new Admin({ username, email, role, admincode });
  await newTeacher.save();
  res.status(201).json({ message: "Registered successfully" });
});

// Edit teacher details
const editAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, role, admincode } = req.body;

  if (!username || !email || !role || !admincode) {
    return res
      .status(400)
      .json({ message: "Username, email, role, and admincode are required" });
  }
  if (role !== "teacher" && role !== "superAdmin") {
    return res
      .status(400)
      .json({ message: "Role must be either 'teacher' or 'superadmin'" });
  }

  // Check if email is being updated to one that already exists for another teacher
  const existingTeacher = await Admin.findOne({ email, _id: { $ne: id } });
  if (existingTeacher) {
    return res
      .status(409)
      .json({ message: "Teacher with this email already exists" });
  }

  const updatedTeacher = await Admin.findByIdAndUpdate(
    id,
    { username, email, role, admincode },
    { new: true }
  );
  if (!updatedTeacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }
  res.json({
    message: "Teacher updated successfully",
    teacher: updatedTeacher,
  });
});

// Delete a teacher
const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  if (admin.role !== "teacher") {
    return res
      .status(400)
      .json({ message: "Only teacher role can be deleted" });
  }
  await Admin.findByIdAndDelete(id);
  res.json({ message: "Teacher deleted successfully" });
});

// List all teachers
const listAdmin = asyncHandler(async (req, res) => {
  try {
    // Find all users with role 'admin' or 'teacher' or 'superadmin'
    const users = await Admin.find({
      role: { $in: ["teacher", "superAdmin"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const listTeachers = asyncHandler(async (req, res) => {
  try {
    // Find all users with role 'teacher'
    const teachers = await Admin.find({ role: "teacher" });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, admincode } = req.body;
  if (!email || !admincode) {
    return res
      .status(400)
      .json({ message: "Email and admincode are required" });
  }
  const teacher = await Admin.findOne({ email });
  if (!teacher) {
    return res.status(401).json({ message: "Invalid email or admincode" });
  }
  // For demo: plain text admincode check. In production, use hashed passwords.
  if (teacher.admincode !== admincode) {
    return res.status(401).json({ message: "Invalid email or admincode" });
  }
  // Check if user is teacher or superadmin
  if (teacher.role !== "teacher" && teacher.role !== "superAdmin") {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  res.json({ message: "Login successful", teacher });
});

module.exports = {
  registerAdmin,
  editAdmin,
  deleteAdmin,
  listAdmin,
  listTeachers,
  loginAdmin,
};
