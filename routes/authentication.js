const express = require("express");

const { postCreateUser, postLogin, logout, postLoginCheckEmail } = require("../controllers/authentication");

const { body } = require("express-validator");

const router = express.Router();


router.post(
  "/create-user",
  [
    body("name").trim().isLength({ min: 4 }),
    body("surname").trim().isLength({ min: 4 }),
    body("password").trim().isLength({ min: 8 }),
    body("email").isEmail().trim().isLength({ min: 8 }),
    body("phone").isMobilePhone().trim().isLength({ min: 4 }),
  ],
  postCreateUser
);

router.post(
  "/login",
  [
    body("password").trim().isLength({ min: 8 }),
    body("email").isEmail().trim().isLength({ min: 8 }),
  ],
  postLogin
);

router.post(
  "/login-check-email",
  [
    body("email").isEmail().trim().isLength({ min: 8 }),
  ],
  postLoginCheckEmail
);
router.delete(
  "/logout",
  // validateToken,
  logout
);

module.exports = router;
