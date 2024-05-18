import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js'; // Assuming the UserModel file is named UserModel.js

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Ensure that each doctor has a unique email address
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feesPerConsultation: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  timings: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

// Define the association
Doctor.belongsTo(User); // Each doctor belongs to a user

export default Doctor;