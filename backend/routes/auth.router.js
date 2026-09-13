import express from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken";
const router = express.Router();

const serverError = (res) => {
  res.status(500).send({
    success: false,
    message: "INTERNAL_SERVER_ERROR",
  });
};

const Unauthorized = (res) => {
  res.status(401).send({
    success: false,
    message: "401_UNAUTHORIZED",
  });
};
const InvalidCreds = (res) => {
  res.status(401).send({
    success: false,
    message: "INVALID_CREDENTIALS",
  });
};
const setCookies = (res, refreshToken, accessToken) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/auth/refresh",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  res.cookie("Authorization", "Bearer " + accessToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 10 * 60 * 1000,
  });
};

const setTokens = (userID) => {
  const accessToken = jwt.sign(
    {
      sub: userID,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" },
  );
  const refreshToken = jwt.sign(
    {
      sub: userID,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "10d" },
  );
  return [accessToken, refreshToken];
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
        message: "PASSWORD_MUST_HAVE_ATLEAST_8_CHARACTERS",
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
      const [accessToken, refreshToken] = setTokens(newUser.id);
      setCookies(res, refreshToken, accessToken);
      return res.status(201).send({
        success: true,
        data: newUser,
      });
    } catch (err) {
      if (err.errors.user?.kind == "unique") {
        return res.status(400).send({
          success: false,
          message: "USERNAME_TAKEN",
        });
      }
      if (err.errors.email?.kind == "unique") {
        return res.status(400).send({
          success: false,
          message: "EMAIL_ALREADY_REGISTERED",
        });
      }
      return res.status(400).send({
        success: false,
        message: "BAD_REQUEST",
      });
    }
  } catch (err) {
    console.error(err.message);
    return serverError(res);
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
    const userDetails = await UserModel.findOne({
      user: req.body.user,
    });
    if (!userDetails) {
      return InvalidCreds(res);
    }
    const { _id, passwordHash, user: username } = userDetails;
    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (passwordMatch == false) {
      return res.send({
        success: false,
        message: "INCORRECT_PASSWORD",
      });
    }
    const [accessToken, refreshToken] = setTokens(_id);
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
    setCookies(res, refreshToken, accessToken);
    return res.status(200).send({
      success: true,
      message: "LOGIN_SUCCESSFUL",
    });
  } catch (err) {
    console.error(err.message);
    return serverError(res);
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
          const [accessToken, newRefreshToken] = setTokens(refreshToken.sub);
          setCookies(res, newRefreshToken, accessToken);
          try {
            const hashed_refreshToken = await bcrypt.hash(newRefreshToken, 10);
            await UserModel.updateOne(
              { _id: refreshToken.sub },
              { refreshToken: hashed_refreshToken },
            );
          } catch (err) {
            console.log(err);
            return serverError(res);
          }
          return res.status(200).send({
            success: true,
            message: "REFRESH_SUCCSESFUL",
          });
        }
        return Unauthorized(res);
      } catch (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(401).send({
            success: false,
            message: "LOG_IN_REQUIRED",
          });
        }
        return Unauthorized(res);
      }
    }
  } catch (err) {
    console.error(err.message);
    return serverError(res);
  }
});

export default router;
