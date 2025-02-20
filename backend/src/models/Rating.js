import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Store from "./Store.js";

const Rating = sequelize.define("Rating", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

Rating.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Rating.belongsTo(Store, { foreignKey: "storeId", onDelete: "CASCADE" });

export default Rating;
