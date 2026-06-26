const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/users.js");

router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);
router.get("/logout", ctrl.logout);
router.get("/me", ctrl.me);

module.exports = router;
