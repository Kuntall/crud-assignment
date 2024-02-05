import express from "express";
const router = express.Router();
import {
  userRegistration,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

// Public route
router.get("/users", getAllUsers);
router.post("/register", userRegistration);
router.patch("/update", updateUser);
router.delete("/delete", deleteUser);

// Private route

export default router;
