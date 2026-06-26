const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Restaurant = require("../models/restaurant.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ Connected to DB");

  // Create admin user
  await User.deleteMany({});
  const adminUser = new User({ email: "admin@safeeats.com", username: "admin", role: "admin" });
  const registered = await User.register(adminUser, "password123");
  console.log("👤 Admin user created: admin / password123");

  // Seed restaurants
  await Restaurant.deleteMany({});
  const restaurants = initData.data.map((r) => ({
    ...r,
    owner: registered._id,
    hygieneGrade: computeGrade(r.hygieneScore),
  }));
  await Restaurant.insertMany(restaurants);
  console.log(`🍽️  Seeded ${restaurants.length} restaurants`);

  await mongoose.disconnect();
  console.log("Done.");
}

function computeGrade(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

main().catch(console.error);