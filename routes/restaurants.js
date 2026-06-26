const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const ctrl = require("../controllers/restaurants.js");

router.get("/", wrapAsync(ctrl.index));
router.post("/", isLoggedIn, upload.single("image"), wrapAsync(ctrl.create));
router.get("/:id", wrapAsync(ctrl.show));
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), wrapAsync(ctrl.update));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ctrl.destroy));

module.exports = router;
