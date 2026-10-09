const Review = require("./review-modal");

module.exports = new (class reviewRepository {
  // Return all reviews from the database.
  // async findAllReviews() {
  //   return await Review.findAll();
  // }

async findAllReviews() {
  return await Review.findAll({
    order: [
      ["createdAt", "DESC"]
    ]
  });
}


  // Create a new review record using the provided data.
  async createReview(reviewData) {
    console.log("ID VALUE:", reviewData.id);
    const review = await Review.findByPk(reviewData.id);
    if(review)
    {
      return await review.update(reviewData);
    }
    return await Review.create(reviewData);
  }

  // Update an existing review by ID.
  // If no matching review is found, return null.
  async updateReview(reviewId, newReviewData) {
    const review = await Review.findByPk(reviewId);
    if (review) 
      {
        return await review.update(newReviewData);
      }
    
    return null;
  }

  // Delete a review by ID.
  // Return true if the review was removed, otherwise false.
  async deleteReview(reviewId) {
    const review = await Review.findByPk(reviewId);
    if (review) {
      await review.destroy();
      return true;
    }
    return false;
  }
})();
