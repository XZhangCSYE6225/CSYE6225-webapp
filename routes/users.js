import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getUserById, updateUserById, register } from "../controllers/users.js";

const router = express.Router()

router.route("/v1/user/:id")
    .get(verifyToken, getUserById)
    .put(verifyToken, updateUserById);

router.post("/v1/user", register);


export default router