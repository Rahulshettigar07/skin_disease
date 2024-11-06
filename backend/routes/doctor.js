// routes/doctors.js
const express = require('express');

const { getAllDoctors, getDoctorById } = require('../controller/doctor');
const router = express.Router();


router.get('/doctors', getAllDoctors);


router.get('/doctor/:id', getDoctorById);


// router.post('/', doctorController.createDoctor);

// router.delete('/:id', doctorController.deleteDoctor);

// router.put('/:id', doctorController.updateDoctor);

module.exports = router;
