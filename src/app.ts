import router from "./routes/index";
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.route";

dotenv.config();

const app = express();
const PORT: number = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", router);
app.use("/api/dashboard", dashboardRoutes);

app.listen(PORT, (error?: any) => {
  if (!error) {
    console.log("Server is running on port " + PORT);
  } else {
    console.log("Error occurred", error);
  }
});
