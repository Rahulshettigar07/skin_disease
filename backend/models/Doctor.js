const mongoose = require('mongoose');


const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  clinic: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  ratings: { type: Number, required: true, default: 0 },
  available: { type: Boolean, default: true }
});


module.exports = mongoose.model('Doctor', doctorSchema);
