import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { Op } from "sequelize";

// Get All Users with Sorting & Filtering (Admin Only)
export const getAllUsers = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", name, email, address, role } = req.query;

    const whereCondition = {};

    if (name) whereCondition.name = { [Op.like]: `%${name}%` };
    if (email) whereCondition.email = { [Op.like]: `%${email}%` };
    if (address) whereCondition.address = { [Op.like]: `%${address}%` };
    if (role) whereCondition.role = role;

    const users = await User.findAll({
      where: whereCondition,
      attributes: ["id", "name", "email", "address", "role"],
      order: [[sortBy, order]],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Admin Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};
