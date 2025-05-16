const fs = require("fs").promises;
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');


const USERS_FILE = "./users.json";

// Get user courses
router.get("/courses", async (req, res) => {
    const userId = req.session.userId 
  const data = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  const courses = data[userId]?.courses || {};
  res.json(courses);
});

// Add or update a course
router.post("/courses", async (req, res) => {
    const userId = req.session.userId 
  const { name, color } = req.body;

  const data = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  if (!data[userId]) data[userId] = { courses: {} };
  data[userId].courses[name] = color;

  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Delete a course
router.delete("/courses/:name", async (req, res) => {
    const userId = req.session.userId 
  const courseName = decodeURIComponent(req.params.name);

  const data = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  delete data[userId]?.courses[courseName];

  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

module.exports = router;