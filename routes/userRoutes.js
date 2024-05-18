import { Router } from "express";
import { applyDoctorController, authController, bookAppointmentController, bookingAvailabilityController, deleteAllNotificationController, getAllDoctorsController, getAllNotificationController, loginController, registerController, userAppointmentsController } from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Router object
const router = Router();

// Routes
// LOGIN || POST
router.post("/login", loginController);

// REGISTER || POST
router.post("/register", registerController);

//Auth Post
router.post("/getUserData", authMiddleware, authController);

//APply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

router.post(
    "/get-all-notification", authMiddleware, getAllNotificationController  );
   
   

  //Notifiaction  Doctor || POST
  router.post(
    "/delete-all-notification",authMiddleware,deleteAllNotificationController );
  
 

  //GET ALL DOC
  router.get("/getAllDoctors", authMiddleware,getAllDoctorsController);
  
  //BOOK APPOINTMENT
  router.post("/book-appointment", authMiddleware,bookAppointmentController);
  
  //Booking Avliability
  router.post(
    "/booking-availbility",
    authMiddleware,
    bookingAvailabilityController
  );
  
  //Appointments List
  router.get("/user-appointments", authMiddleware,userAppointmentsController);
  

export default router;