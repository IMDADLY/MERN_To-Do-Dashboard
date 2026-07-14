import express from "express";
import { connectDB } from "./config/db.js";
import todosRouter from "./routes/todos.router.js";
import authRouter from "./routes/auth.router.js";
import jwt from "jsonwebtoken";
const PORT = process.env.PORT;
const app = express();
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const authenaticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send({
      success: false,
      message: "No authentication token",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send({
      success: false,
      message: "403 Forbidden",
    });
  }
};

app.use(logger); //middleware
app.use(express.json()); //middleware- allow application to use json
app.use("/auth", authRouter); //authentication
app.use("/api/todos", authenaticateToken, todosRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at ${PORT}`);
});

//Authentication verifies who you are, while authorization determines what you are allowed to access
