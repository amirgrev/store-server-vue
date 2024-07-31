import {} from "dotenv/config.js";
import cors from "cors";
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import postsRouter from "./routes/posts_routes.js";
import userRouter from "./routes/user_routes.js";
import shoseRouter from "./routes/shose_routes.js";
import orderRouter from "./routes/order_routes.js";

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("DB ok!");
  })
  .catch((e) => console.log("DB error", e));

const app = express();
const PORT = 4444;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (__, ___, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(userRouter);
app.use(postsRouter);
app.use(shoseRouter);
app.use(orderRouter);
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server have started on port: ${PORT}`);
});
