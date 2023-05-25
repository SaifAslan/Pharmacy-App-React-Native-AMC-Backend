const express = require("express");

const { query } = require("express-validator");

const router = express.Router();
const { getPharmacies, getPharmacy } = require("../controllers/api");

router.get("/pharmacies", [query("location").isLatLong()], getPharmacies);
router.get(
  "/pharmacy",
  [query("placeid").isString().isLength({ min: 4 })],
  getPharmacy
);

module.exports = router;
