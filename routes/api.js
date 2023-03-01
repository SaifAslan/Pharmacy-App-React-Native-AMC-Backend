const express = require("express");


const { body,query } = require("express-validator");

const router = express.Router();
// GET /feed/posts
const jwt = require("jsonwebtoken");
const { getPharmacies } = require("../controllers/api");

router.get("/pharmacies",[query('location').isLatLong()] ,getPharmacies);



module.exports = router;