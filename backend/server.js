import express from "express";
import { connectDB } from "./config/db.js";
import todosRouter from "./routes/todos.router.js";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const PORT = process.env.PORT;
const app = express();
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const Unauthorized = (res) => {
  res.status(401).send({
    success: false,
    message: "401 Unauthorized",
  });
};

const authenaticateToken = async (req, res, next) => {
  if (req.cookies?.Authorization) {
    const accessToken = req.cookies.Authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (Math.floor(Date.now() / 1000) <= decoded.exp) {
        const { sub } = decoded;
        req.user = { sub };
        next();
      } else {
        res.status(401).send({
          success: false,
          message: "TOKEN_EXPIRED",
        });
      }
    } catch (err) {
      res.status(401).send({
        success: false,
        message: "INVALID_TOKEN",
      });
    }
  } else {
    Unauthorized(res);
  }
};

app.use(logger); //middleware
app.use(express.json()); //middleware- allow application to use json
app.use(cookieParser());
app.use("/auth", authRouter); //authentication
app.use("/api/todos", authenaticateToken, todosRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at ${PORT}`);
});

//Authentication verifies who you are, while authorization determines what you are allowed to access
