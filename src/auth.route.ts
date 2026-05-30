import { Router } from "express";

import {
  signupController,
  loginController,
} from "./auth.controller";

const router = Router();


// SIGNUP
router.post("/signup", signupController);


// LOGIN
router.post("/login", loginController);


export default router;