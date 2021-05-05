import * as express from "express";
import * as cors from "cors";
import { connectDB } from "./database";
import taskRoute from "./main/task/task.routing";
import reportRoute from "./main/report/report.routing";
import authRoute from "./main/auth/auth.routing";
import userRoute from "./main/user/user.routing";
import defaultExceptionHandler from "./exception/default.exception";

const startServer = () => {
  // create and setup express app
  const app: express.Application = express();
  app.use(express.json());
  // Deal with CORS
  app.use(cors());
  app.use("/api/tasks", taskRoute);
  app.use("/api/reports", reportRoute);
  app.use("/api/auth", authRoute);
  // app.use("/api/user", userRoute);

  app.use(defaultExceptionHandler);

  // start express server
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API Server is running at port ${port}.`));
};

(async () => {
  await connectDB();
  startServer();
})();
