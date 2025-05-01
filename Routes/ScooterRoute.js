const express = require('express');
const router = express.Router();
const scooterController = require('../controller/ScooterController');
const { upload } = require("../service/cloudinary");

// Get all cars
router.get('/all', scooterController.getAllScooter);

// add car
router.post('/addscooter', upload.single('imageUrl'), scooterController.addScooter);

    
// Get car by ID
router.get('/:id', scooterController.getScooterById);



// Update a car
router.put('/:id',scooterController.updateScooter);

// Delete a car
router.delete('/:id', scooterController.deleteScooter);

module.exports = router;