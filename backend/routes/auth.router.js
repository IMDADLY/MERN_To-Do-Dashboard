import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const serverError = (res) => {
  res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { user, password, email } = req.body;
    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must have atleast 8 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      user,
      passwordHash: hashedPassword,
      email,
    };
    try {
      const newUser = await UserModel.create(userData);
      res.status(201).send({
        success: true,
        data: newUser,
      });
    } catch (err) {
      console.error(err.message);
      res.status(400).send({
        success: false,
        message: "400 Bad Request",
      });
    }
  } catch (err) {
    console.error(err.message);
    serverError(res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user || !password) {
      return res.status(400).send({
        success: false,
        message: "User and password are required",
      });
    }
    const InvalidCreds = () => {
      res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    };
    const userDetails = await UserModel.findOne({
      user: req.body.user,
    });
    if (!userDetails) {
      return InvalidCreds;
    }
    const { _id, passwordHash, user: username } = userDetails;
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (!passwordMatch) {
      return InvalidCreds;
    }
    const accessToken = jwt.sign(
      {
        sub: _id,
        user: username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      {
        sub: _id,
        user: username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" },
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    console.error(err.message);
    serverError(res);
  }
});

export default router;
