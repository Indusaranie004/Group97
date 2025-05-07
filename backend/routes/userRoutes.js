// userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
} = require('../controllers/userController');

router
  .route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete( deleteUserAccount);

router.route('/').get(getAllUsers);
  

module.exports = router;