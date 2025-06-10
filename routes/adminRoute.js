const express = require("express");
const {
  registerAdmin,
  editAdmin,
  deleteAdmin,
  listAdmin,
  listTeachers,
  loginAdmin,
} = require("../controller/adminController");

const teacherRoute = express.Router();
teacherRoute.post("/register", registerAdmin);
teacherRoute.post("/login", loginAdmin);
teacherRoute.delete("/delete/:id", deleteAdmin);
teacherRoute.put("/edit", editAdmin);
teacherRoute.get("/listTeachers", listTeachers);
teacherRoute.get("/listAll", listAdmin);

module.exports = teacherRoute;
