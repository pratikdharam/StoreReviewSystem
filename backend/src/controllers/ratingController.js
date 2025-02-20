import Rating from "../models/Rating.js";



// Submit Rating
export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
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

    const existingRating = await Rating.findOne({ where: { id: ratingId, userId } });
    if (!existingRating) {
      return res.status(404).json({ message: "Rating not found or unauthorized" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
    }

    existingRating.rating = rating;
    await existingRating.save();

    res.status(200).json({ message: "Rating updated successfully", rating: existingRating });
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error: error.message });
  }
};


// Get Ratings for a Store (Store Owner Only)
export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).json({ message: "Store ID is required" });

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, attributes: ["name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error: error.message });
  }
};