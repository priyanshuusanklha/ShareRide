const express = require('express');
const router = express.Router();
const { createRide, getRides, getRideById, updateRide, deleteRide, getMyRides } = require('../controllers/rideController');
const { protect } = require('../middleware/auth');
const { validateRide, handleValidationErrors } = require('../middleware/validate');

router.post('/', protect, validateRide, handleValidationErrors, createRide);
router.get('/', getRides);
router.get('/my/rides', protect, getMyRides);
router.get('/:id', getRideById);
router.put('/:id', protect, updateRide);
router.delete('/:id', protect, deleteRide);

module.exports = router;
