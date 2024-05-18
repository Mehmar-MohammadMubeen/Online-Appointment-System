import { DataTypes } from 'sequelize';  // No need to import UUID separately
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
  notification: {
    type: DataTypes.TEXT, // Use TEXT data type to store JSON strings
    defaultValue: JSON.stringify([]), // Default value as empty JSON array
    get() {
      const value = this.getDataValue('notification');
      return value? JSON.parse(value) : []; // Check if value is not null before parsing
    },
    set(value) {
      this.setDataValue('notification', JSON.stringify(value)); // Convert JavaScript array to JSON string
    },
  },
  seenNotification: {
    type: DataTypes.TEXT, // Use TEXT data type to store JSON strings
    defaultValue: JSON.stringify([]), // Default value as empty JSON array
    get() {
      const value = this.getDataValue('seenNotification');
      return value? JSON.parse(value) : []; // Check if value is not null before parsing
    },
    set(value) {
      this.setDataValue('seenNotification', JSON.stringify(value)); // Convert JavaScript array to JSON string
    },
  },
});

export default User;