const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const computeGrade = (score) => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
};

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: { url: String, filename: String },
    location: String,
    city: { type: String, default: "Bengaluru" },
    category: {
      type: String,
      enum: ["Street Food", "Restaurant", "Cafe", "Hotel", "Dhaba", "Fast Food"],
      default: "Restaurant",
    },
    hygieneScore: { type: Number, min: 0, max: 100, default: 75 },
    hygieneGrade: { type: String, enum: ["A", "B", "C", "D", "F"] },
    lastInspected: { type: Date, default: Date.now },
    violations: [{ type: String }],
    geometry: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-compute grade before save
restaurantSchema.pre("save", function (next) {
  this.hygieneGrade = computeGrade(this.hygieneScore);
  next();
});

restaurantSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.hygieneScore !== undefined) {
    update.hygieneGrade = computeGrade(update.hygieneScore);
  }
  next();
});

// Cascade delete reviews
restaurantSchema.post("findOneAndDelete", async (restaurant) => {
  if (restaurant) {
    await Review.deleteMany({ _id: { $in: restaurant.reviews } });
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
