const express = require("express");
const router = express.Router();
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/emailPreferencesCtrl");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getPreferences);
router.put("/", authenticateToken, updatePreferences);

module.exports = router;
