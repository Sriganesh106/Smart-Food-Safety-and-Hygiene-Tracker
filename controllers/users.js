const User = require("../models/user.js");
const passport = require("passport");

// POST /api/users/signup
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registered = await User.register(user, password);
    req.login(registered, (err) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        user: { _id: registered._id, username: registered.username, email: registered.email, role: registered.role },
      });
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// POST /api/users/login
module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        success: true,
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
      });
    });
  })(req, res, next);
};

// GET /api/users/logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: "Logged out" });
  });
};

// GET /api/users/me
module.exports.me = (req, res) => {
  if (!req.user) return res.json({ success: true, user: null });
  res.json({
    success: true,
    user: { _id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role },
  });
};