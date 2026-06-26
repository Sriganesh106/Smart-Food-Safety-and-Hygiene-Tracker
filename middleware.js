const Restaurant = require("./models/restaurant.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "You must be logged in" });
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });
  if (!restaurant.owner.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "You do not have permission" });
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  if (!review.author.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "You do not have permission" });
  }
  next();
};
