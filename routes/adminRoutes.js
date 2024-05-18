import express from "express";
import {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} from "../controllers/adminCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

export default router;
