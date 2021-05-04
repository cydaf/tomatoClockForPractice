import { Router } from "express";
import * as controller from "./task.controller";
import { checkJWT } from "../../common/checkJWT";
import { asyncHandler } from "../../common/utils";
import { createPipe } from "./task.pipe";

const taskRoute = Router();
taskRoute
  .route("/")
  .get(checkJWT, asyncHandler(controller.getTasks))
  .post(checkJWT, asyncHandler(controller.createTasks));

taskRoute
  .route("/:id")
  .patch(checkJWT, controller.updateTasks)
  .delete(checkJWT, controller.removeTasks);

export default taskRoute;
