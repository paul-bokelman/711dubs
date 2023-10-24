import { Router } from "express";
import * as controllers from "./controllers";
import { validate } from "../../middleware";

export const users = Router();

users.get("/leaderboard", controllers.getUserLeaderboard.handler);
users.post("/create", validate(controllers.createUser.schema), controllers.createUser.handler);
users.post("/updateLeaderboard", validate(controllers.updateLeaderboard.schema), controllers.updateLeaderboard.handler);
