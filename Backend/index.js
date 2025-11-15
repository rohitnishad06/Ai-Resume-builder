const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./configs/db");
const userRouter = require("./routes/userRoutes");
const resumeRouter = require("./routes/resumeRoutes");
const aiRouter = require("./routes/aiRoutes");
const path = require("path");

const app = express();
port = process.env.PORT || 8000;
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());

// production
const _dirname = path.resolve();

// Routes
app.use("/api/users/", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

//production
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});


// starting server & db
app.listen(port, async () => {
  await dbConnect();
  console.log(`server is running on ${port}`);
});
