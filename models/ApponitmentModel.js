import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';// Assuming the UserModel file is named UserModel.js
import Doctor from './DoctorModel.js'; // Assuming the DoctorModel file is named DoctorModel.js
import User from './userModel.js';

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'id',
    },
  },
  doctorInfo: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  userInfo: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

// Define the associations
Appointment.belongsTo(User, { foreignKey: 'userId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

export default Appointment;
