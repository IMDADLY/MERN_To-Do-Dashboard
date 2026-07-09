import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res) => {
  if (req.body.password.length < 8) {
    res.status(400).json({
      success: false,
      message: "Password must have atleast 8 characters",
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const user = {
      user: req.body.user,
      passwordHash: hashedPassword,
      email: req.body.email,
    };
    try {
      const newUser = await UserModel.create(user);
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const userDetails = await UserModel.findOne({
    user: req.body.user,
  });
  if (!userDetails) {
    res.status(404).json({
      success: false,
      message: "404 Not Found",
    });
  }
  const { _id, passwordHash, user } = userDetails;
  try {
    bcrypt.compare(req.body.password, passwordHash, async (err, same) => {
      if (same) {
        const accessToken = jwt.sign(
          { sub: _id, name: user },
          process.env.ACCESS_TOKEN_SECRET,
        );
        await UserModel.updateOne({ _id: _id }, { jwt: accessToken });
        res.status(200).json({
          success: true,
          message: "Login successful!",
          accessToken: accessToken,
        });
      } else {
        res.status(401).json({
          success: false,
          message: err,
        });
      }
    });
  } catch (err) {
    console.log(`Error : ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
