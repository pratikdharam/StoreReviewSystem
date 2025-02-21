import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: {
        args: [20, 60],
        msg: "Name must be between 20 and 60 characters"
      }
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Please enter a valid email address"
      }
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      passwordStrength(value) {
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(value)) {
          throw new Error('Password must be 8-16 characters long, include at least one uppercase letter and one special character');
        }
      }
    }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: {
        args: [1, 400],
        msg: "Address cannot exceed 400 characters"
      }
    },
  },
  role: {
    type: DataTypes.ENUM("admin", "user", "store_owner"),
    allowNull: false,
    validate: {
      isIn: {
        args: [["admin", "user", "store_owner"]],
        msg: "Invalid role specified"
      }
    },
  },
});

export default User;