import { Router } from "express";
import { users } from "./user";

export const services = Router();

services.use("/users", users);
