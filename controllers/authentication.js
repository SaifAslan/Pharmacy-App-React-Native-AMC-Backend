const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
  // res.status(200).json({
  //   posts: [
  //     {
  //       _id: "2",
  //       title: "first post",
  //       content: "This is the first post!",
  //       imageUrl: "images/aston.jpg",
  //       createdAt: new Date(),
  //       creator: { name: "Saif" },
  //     },
  //   ],
  // });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      return post.update({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
      });
    })
    .then((result) => {
      res.status(200).json({
        message: `Post with id of ${postId} edited`,
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postCreateUser = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    console.log(errors);
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  // if (!req.file) {
  //   const error = new Error("Feed image is missing.");
  //   error.status = 422; //validation error
  //   throw error;
  // }
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        phone: phone,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created successfully",
        user: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // console.log(title, content);
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find email or wrong email.");
        error.statusCode = 404;
        throw error;
      }
      return { bcrypt: bcrypt.compare(password, user.password), user };
    })
    .then((result) => {
      if (!result.bcrypt) {
        const error = new Error("Wrong password.");
        error.statusCode = 401;
        throw error;
      }
      const accessToken = generateAccessToken({ user: req.body.name });
      result.user.accessToken = accessToken;
      return result.user.save();
    })
    .then((user) => {
      res.status(200).json({
        message: "User logged in successfully",
        user: {
          name: user.name,
          surname: user.name,
          email: user.email,
          phone: user.phone,
          accessToken: user.accessToken,
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err)
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLoginCheckEmail = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find email or wrong email.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "User email validated successfully",
      });
    })
    .catch((err) => {
      res.status(500).json(err)
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logout = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  User.findOne({ accessToken: token })
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        throw error;
      }
      user.accessToken = undefined;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "Logged out!" });
    })
    .catch((err) => {
      res.status(500).json(err)
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};



// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}
