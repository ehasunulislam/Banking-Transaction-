const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

/*
 * - user register cont6roller
 * - post =>  /api/auth/register
 */

async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  const existingUser = await userModel.findOne({
    email: email,
  });

  if (existingUser) {
    return res.status(422).json({
      message: "user already exists with email.",
      status: failed,
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
    expiresIn: "3d",
  });

  res.cookie("jwt_token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },

    token,
  });

  await emailService.sendRegistrationEmail(user.email, user.name)
}

/*
 * - user register cont6roller
 * - post =>  /api/auth/register
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.staus(401).json({
      message: "Email or Password is Invalid",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.staus(401).json({
      message: "Email or Password is Invalid",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
    expiresIn: "3d",
  });

  res.cookie("jwt_token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },

    token,
  });
}

module.exports = { userRegisterController, userLoginController };
