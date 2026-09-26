const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  linkWallet,
  unlinkWallet,
} = require("../controllers/userController");

router.use(protect);

router.get("/profile", getProfile);
router.patch("/wallet", linkWallet);
router.delete("/wallet", unlinkWallet);

module.exports = router;
