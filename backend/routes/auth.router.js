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

const Unauthorized = (res) => {
  res.status(401).send({
    success: false,
    message: "401 Unauthorized",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { user, password, email } = req.body;
    if (!user || !password || !email) {
      return res.status(400).send({
        success: false,
        message: "REQUIRED_INPUT",
      });
    }
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
        message: "REQUIRED_INPUT",
      });
    }
    const InvalidCreds = (res) => {
      res.status(401).send({
        success: false,
        message: "INVALID_CREDENTIALS",
      });
    };
    const userDetails = await UserModel.findOne({
      user: req.body.user,
    });
    if (!userDetails) {
      return InvalidCreds(res);
    }
    const { _id, passwordHash, user: username } = userDetails;
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (passwordMatch == false) {
      return InvalidCreds(res);
    }
    const accessToken = jwt.sign(
      {
        sub: _id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      {
        sub: _id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" },
    );
    try {
      const hashed_refreshToken = await bcrypt.hash(refreshToken, 10);
      await UserModel.updateOne(
        { _id: _id },
        { refreshToken: hashed_refreshToken },
      );
    } catch (err) {
      console.error(err.message);
      return serverError(res);
    }
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.cookie("Authorization", "Bearer " + accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });
    res.status(200).send({
      success: true,
      message: "LOGIN_SUCCESSFUL",
    });
  } catch (err) {
    console.error(err.message);
    serverError(res);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    if (req.cookies?.jwt) {
      try {
        const refreshToken = jwt.verify(
          req.cookies.jwt,
          process.env.REFRESH_TOKEN_SECRET,
        );
        const check = await UserModel.findOne({ _id: refreshToken.sub });
        const tokenMatch = await bcrypt.compare(
          req.cookies.jwt,
          check.refreshToken,
        );
        if (tokenMatch) {
          const accessToken = jwt.sign(
            {
              sub: refreshToken.sub,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" },
          );
          const newRefreshToken = jwt.sign(
            {
              sub: refreshToken.sub,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" },
          );
          res.cookie("Authorization", "Bearer " + accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000,
          });
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: 10 * 24 * 60 * 60 * 1000,
          });
          res.status(200).send({
            success: true,
            message: "REFRESH_SUCCSESFUL",
          });
        } else Unauthorized(res);
      } catch (err) {
        if (err.name == "TokenExpiredError") {
          res.status(401).send({
            success: false,
            message: "LOG_IN_REQUIRED",
          });
        } else {
          Unauthorized(res);
        }
      }
    } else Unauthorized(res);
  } catch (err) {
    console.error(err.message);
    serverError(res);
  }
});

export default router;
