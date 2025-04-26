import express from 'express';
import { signup, signin, getCoachProfile, updateCoachProfile } from '../Controller/coachController.js';
import auth from '../middleware/auth.js'; // Ensure the path and extension are correct

const router = express.Router();

// Public Routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected Routes (Require Authentication)

router.get('/profile', auth, getCoachProfile);
router.put('/profile', auth, updateCoachProfile);

export default router;
