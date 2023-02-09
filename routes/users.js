import express from "express";
import { verifyTokenUser } from "../middleware/auth.js";
import { getUserById, updateUserById, register } from "../controllers/users.js";

const router = express.Router()

router.route("/user/:id")
    .get(verifyTokenUser, getUserById)
    .put(verifyTokenUser, updateUserById);

router.post("/user", register);


export default router