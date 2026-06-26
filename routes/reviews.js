const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ctrl = require("../controllers/reviews.js");

router.post("/", isLoggedIn, wrapAsync(ctrl.create));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ctrl.destroy));

module.exports = router;
