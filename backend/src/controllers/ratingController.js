import Rating from "../models/Rating.js";
import User from "../models/User.js";
import Store from "../models/Store.js";


// Submit Rating
export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Validate rating value
    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
    }

    // Check if user has already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId }
    });

    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this store. Use update instead." });
    }

    const newRating = await Rating.create({ userId, storeId, rating });
    res.status(201).json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error: error.message });
  }
};

// Update Rating
export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;
    const ratingId = req.params.id;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
    }

    const existingRating = await Rating.findOne({
      where: { id: ratingId, userId }
    });

    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found or unauthorized" });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.status(200).json({ message: "Rating updated successfully", rating: existingRating });
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error: error.message });
  }
};

// Get User's Rating for a Store
export const getUserRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.storeId;

    const rating = await Rating.findOne({
      where: { userId, storeId }
    });

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rating", error: error.message });
  }
};

// Get Store Owner's Store Ratings
export const getStoreOwnerRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    // First get the store owned by this user
    const store = await Store.findOne({
      where: { ownerId: userId }
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    // Get all ratings for this store
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{
        model: User,
        attributes: ['name', 'email'] // Only include necessary user info
      }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    res.status(200).json({
      store,
      ratings,
      stats: {
        totalRatings,
        averageRating: averageRating.toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching store owner ratings:', error);
    res.status(500).json({ message: "Error fetching ratings", error: error.message });
  }
};