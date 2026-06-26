const Restaurant = require("../models/restaurant.js");

// Only init Mapbox geocoding if token is valid (starts with pk.)
let geocodingClient = null;
try {
  const mapToken = process.env.MAP_TOKEN;
  if (mapToken && mapToken.startsWith("pk.")) {
    const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
    geocodingClient = mbxGeocoding({ accessToken: mapToken });
  }
} catch (_) {}

const computeGrade = (score) => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
};

// GET /api/restaurants
module.exports.index = async (req, res) => {
  const { grade, category, search } = req.query;
  const filter = {};
  if (grade) filter.hygieneGrade = grade.toUpperCase();
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const restaurants = await Restaurant.find(filter).populate("owner", "username");
  res.json({ success: true, restaurants });
};

// GET /api/restaurants/:id
module.exports.show = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author", select: "username" } })
    .populate("owner", "username");
  if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
  res.json({ success: true, restaurant });
};

// POST /api/restaurants
module.exports.create = async (req, res) => {
  const body = req.body;
  // Geocode location
  let geometry = { type: "Point", coordinates: [77.5946, 12.9716] }; // Bengaluru default
  try {
    const geoResponse = await geocodingClient
      .forwardGeocode({ query: body.location + ", Bengaluru, India", limit: 1 })
      .send();
    if (geoResponse.body.features.length > 0) {
      geometry = geoResponse.body.features[0].geometry;
    }
  } catch (_) {}

  const restaurant = new Restaurant({
    ...body,
    hygieneScore: Number(body.hygieneScore) || 75,
    violations: Array.isArray(body.violations)
      ? body.violations
      : body.violations
      ? body.violations.split(",").map((v) => v.trim()).filter(Boolean)
      : [],
    geometry,
    owner: req.user._id,
  });

  if (req.file) {
    restaurant.image = { url: req.file.path, filename: req.file.filename };
  }

  restaurant.hygieneGrade = computeGrade(restaurant.hygieneScore);
  await restaurant.save();
  res.status(201).json({ success: true, restaurant });
};

// PUT /api/restaurants/:id
module.exports.update = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (body.violations && !Array.isArray(body.violations)) {
    body.violations = body.violations.split(",").map((v) => v.trim()).filter(Boolean);
  }
  if (body.hygieneScore) {
    body.hygieneGrade = computeGrade(Number(body.hygieneScore));
  }

  const restaurant = await Restaurant.findByIdAndUpdate(id, body, { new: true });
  if (!restaurant) return res.status(404).json({ success: false, message: "Not found" });

  if (req.file) {
    restaurant.image = { url: req.file.path, filename: req.file.filename };
    await restaurant.save();
  }
  res.json({ success: true, restaurant });
};

// DELETE /api/restaurants/:id
module.exports.destroy = async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Restaurant deleted" });
};
