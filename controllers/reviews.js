const Review = require("../models/review.js");
const Restaurant = require("../models/restaurant.js");

// POST /api/restaurants/:id/reviews
module.exports.create = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

  const review = new Review({ ...req.body, author: req.user._id });
  await review.save();
  restaurant.reviews.push(review._id);
  await restaurant.save();

  await review.populate("author", "username");
  res.status(201).json({ success: true, review });
};

// DELETE /api/restaurants/:id/reviews/:reviewId
module.exports.destroy = async (req, res) => {
  const { id, reviewId } = req.params;
  await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ success: true, message: "Review deleted" });
};