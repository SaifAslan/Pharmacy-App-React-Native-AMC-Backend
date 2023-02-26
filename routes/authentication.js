const express = require("express");

const { getPosts, postPost, getPost, putPost, postCreateUser, postLogin, logout, postLoginCheckEmail } = require("../controllers/authentication");

const { body } = require("express-validator");

const router = express.Router();
// GET /feed/posts
const jwt = require("jsonwebtoken")

router.get("/posts", getPosts);

// POST /feed/post
// router.post(
//   "/post",
//   [
//     body("title").trim().isLength({ min: 7 }),
//     body("content").trim().isLength({ min: 5 }),
//   ],
//   postPost
// );

router.get("/post/:postId", getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 7 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  putPost
);

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

//this middleware function is used to validate the token and usefull only
//when we put limmit on the token

// function validateToken(req, res, next) {
//   //get token from request header
//   const authHeader = req.headers["authorization"]
//   const token = authHeader.split(" ")[1]
//   //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
//   if (token == null) res.sendStatus(400).send("Token not present")
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//   if (err) { 
//    res.status(403).send("Token invalid")
//    }
//    else {
//    req.user = user
//    next() //proceed to the next action in the calling function
//    }
//   }) //end of jwt.verify()
//   } //end of function