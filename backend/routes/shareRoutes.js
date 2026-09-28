const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  resolveRecipient,
  grantShareAccess,
  getSharedWithMe,
  revokeShareAccess,
} = require("../controllers/shareController");

router.use(protect);

router.post("/resolve", resolveRecipient);
router.post("/grant", grantShareAccess);
router.get("/shared-with-me", getSharedWithMe);
router.post("/revoke", revokeShareAccess);

module.exports = router;
