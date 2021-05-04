import { Router } from "express";
import * as controller from "./user.contoller";
import { checkJWT } from "../../common/checkJWT";
import { asyncHandler } from "../../common/utils";

const userRoute = Router();
userRoute.route("/").get(checkJWT, asyncHandler(controller.getUser));

export default userRoute;
