const express = require('express');
const router = express.Router();
const carController = require('../controller/CarController');
const { upload } = require("../service/cloudinary");

// Get all cars
router.get('/all', carController.getAllCars);

// add car
router.post('/addcar', upload.single('imageUrl'), carController.addCar);

// Get cars by category
router.get('/category/:category', carController.getCarsByCategory);
    
// Get car by ID
router.get('/:id', carController.getCarById);



// Update a car
router.put('/:id',carController.updateCar);

// Delete a car
router.delete('/:id', carController.deleteCar);

module.exports = router;