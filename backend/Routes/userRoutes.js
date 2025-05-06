const express = require('express');
const userController = require('../Controller/userController');

const router = express.Router();

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(userController.protect);

router.get('/profile', userController.getProfile);
router.patch('/update-profile', userController.updateProfile);
router.delete('/delete-profile', userController.deleteProfile);

// Coach management routes
router.post('/add-coach', userController.addCoach);
router.delete('/remove-coach/:coachId', userController.removeCoach);

module.exports = router;