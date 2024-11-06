// controllers/doctorsController.js
const Doctor = require('../models/Doctor');

// Fetch all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors list' });
  }
};

// Fetch a doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor profile' });
  }
};

// Create a new doctor
exports.createDoctor = async (req, res) => {
  const { name, specialization, clinic, location, email, password, phoneNumber, ratings } = req.body;

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

    const newDoctor = new Doctor({
      name,
      specialization,
      clinic,
      location,
      email,
      password,
      phoneNumber,
      ratings,
    });

    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor' });
  }
};

// Update a doctor by ID
exports.updateDoctor = async (req, res) => {
  const { name, specialization, clinic, location, email, password, phoneNumber, ratings } = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, {
      name, specialization, clinic, location, email, password, phoneNumber, ratings
    }, { new: true });
    
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

// Delete a doctor by ID
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};
