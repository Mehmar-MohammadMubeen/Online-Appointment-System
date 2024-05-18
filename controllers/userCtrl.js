import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Doctor from "../models/DoctorModel.js";
import moment from 'moment';
import Appointment from "../models/ApponitmentModel.js";

export const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (existingUser) {
      console.error(`User already exists: ${req.body.email}`);
      return res
       .status(400)
       .send({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role, // Set the user role to 'user' if it is not provided
    });

    await newUser.save();

    res.status(201).send({ message: "Registered successfully", success: true });
  } catch (error) {
    console.error("Registration failed:", error);
    res
     .status(500)
     .send({
        success: false,
        message: "Registration failed. Please try again later.",
      });
  }
};

export const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
       .status(400)
       .send({ message: "User not found!", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
       .status(200)
       .send({ message: "Invalid Email or Password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token", success: false });
    }
    res.status(500).send({ message: `Error in Login CTL ${error.message}` });
  }
};

export const authController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
    });
  }
};



export const applyDoctorController = async (req, res) => {
  try {
    const { userId, feesPerConsultation, timings, ...doctorData } = req.body;

    if (!feesPerConsultation) {
      return res.status(400).send({
        success: false,
        message: "Fees per consultation is required",
      });
    }

    if (typeof feesPerConsultation !== "number") {
      return res.status(400).send({
        success: false,
        message: "Fees per consultation must be a number",
      });
    }

    if (!Array.isArray(timings) || timings.length !== 2) {
      return res.status(400).send({
        success: false,
        message: "Timings must be an array with two elements",
      });
    }

    const newDoctor = await Doctor.create({
      userId,
      feesPerConsultation,
      timings,
      ...doctorData,
      status: "pending",
    });

    const adminUser = await User.findOne({ isAdmin: true });
    adminUser.notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await adminUser.save();

    res.status(201).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while applying for doctor",
      error,
    });
  }
};

// Get all notifications
export const getAllNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.seennotification.push(...user.notifcation);
    user.notifcation = [];
    await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in notification",
      error,
    });
  }
};

// Delete all notifications
export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.notifcation = [];
    user.seennotification = [];
    await user.save();
    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

// Get all doctors
export const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};

// Book an appointment
export const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const doctorUser = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    doctorUser.notifcation.push({
      type: "New-appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await doctorUser.save();
    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

// Check booking availability
export const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments not available at this time",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Appointments available",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in booking",
      error,
    });
  }
};

// Get user appointments
export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in user appointments",
      error,
    });
  }
};
