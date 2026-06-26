const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.js");

router.post("/", chatController.handleChat);

module.exports = router;
