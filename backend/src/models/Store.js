import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
});

Store.belongsTo(User, { foreignKey: "ownerId", onDelete: "SET NULL" });

export default Store;
