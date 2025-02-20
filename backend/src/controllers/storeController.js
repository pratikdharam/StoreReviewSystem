import Store from "../models/Store.js";

// Get All Stores with Sorting & Filtering

export const getAllStores = async (req, res) => {
  try {
    const { sortBy = "name", order = "ASC", name, address } = req.query;

    const whereCondition = {};

    if (name) whereCondition.name = { [Op.like]: `%${name}%` };
    if (address) whereCondition.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereCondition,
      order: [[sortBy, order]],
    });

    res.status(200).json(stores);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stores", error: error.message });
  }
};
// Add Store (Only Admin)
export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStore = await Store.create({ name, email, address, ownerId });
    res
      .status(201)
      .json({ message: "Store added successfully", store: newStore });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding store", error: error.message });
  }
};
