import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must have atleast 8 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      user: req.body.user,
      passwordHash: hashedPassword,
      email: req.body.email,
    };
    try {
      const newUser = await UserModel.create(user);
      res.status(201).send({
        success: true,
        data: newUser,
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
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
      { expiresIn: "1h" },
    );
    res.status(200).send({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    console.log(`Error : ${err.message}`);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

export default router;
