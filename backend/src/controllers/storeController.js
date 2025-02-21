import Store from "../models/Store.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

// Get All Stores with Sorting, Filtering & Ratings
export const getAllStores = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", name, email, address } = req.query;

    const whereCondition = {};
    if (name) whereCondition.name = { [Op.like]: `%${name}%` };
    if (email) whereCondition.email = { [Op.like]: `%${email}%` };
    if (address) whereCondition.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Ratings.rating')), 1),
            'rating'
          ],
          [
            sequelize.fn('COUNT', sequelize.col('Ratings.id')),
            'totalRatings'
          ]
        ]
      },
      group: ['Store.id', 'owner.id'],
      order: [[sortBy, order]]
    });

    res.status(200).json(stores);
  } catch (error) {
    console.error('Error in getAllStores:', error);
    res.status(500).json({ 
      message: "Error fetching stores", 
      error: error.message 
    });
  }
};

// Get Single Store
export const getStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Ratings.rating')), 1),
            'rating'
          ],
          [
            sequelize.fn('COUNT', sequelize.col('Ratings.id')),
            'totalRatings'
          ]
        ]
      },
      group: ['Store.id', 'owner.id']
    });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching store", 
      error: error.message 
    });
  }
};

// Add Store (Admin Only)
export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Validate input
    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email is already taken
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Verify owner exists and is a store_owner
    const owner = await User.findOne({
      where: { id: ownerId, role: 'store_owner' }
    });
    if (!owner) {
      return res.status(400).json({ message: "Invalid store owner" });
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    const storeWithOwner = await Store.findByPk(newStore.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({ 
      message: "Store added successfully", 
      store: storeWithOwner 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding store", 
      error: error.message 
    });
  }
};

// Update Store (Admin Only)
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Validate email if it's being updated
    if (email && email !== store.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Verify owner if it's being updated
    if (ownerId) {
      const owner = await User.findOne({
        where: { id: ownerId, role: 'store_owner' }
      });
      if (!owner) {
        return res.status(400).json({ message: "Invalid store owner" });
      }
    }

    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
      ownerId: ownerId || store.ownerId
    });

    const updatedStore = await Store.findByPk(id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(200).json({ 
      message: "Store updated successfully", 
      store: updatedStore 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating store", 
      error: error.message 
    });
  }
};

// Delete Store (Admin Only)
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.destroy();
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting store", 
      error: error.message 
    });
  }
};

export default {
  getAllStores,
  getStore,
  addStore,
  updateStore,
  deleteStore
};