const express = require('express');
const coachController = require('../Controller/coachController'); 
const authMiddleware = require('../middleware/auth');


const router = express.Router();

// Public Routes
router.post('/signup', coachController.signup);
router.post('/signin', coachController.signin);

// Protected Routes (Require Authentication)

router.get('/dashboard', authMiddleware, coachController.getCoachProfile);
router.put('/dashboard/update', authMiddleware, coachController.updateCoachProfile);

router.get('/', coachController.getAllCoaches);
router.get('/:id', coachController.getCoachProfile);
router.put('/:id', coachController.updateCoachProfile);
router.delete('/:id', coachController.deleteCoachProfile);

module.exports = router;
