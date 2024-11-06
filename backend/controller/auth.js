const User = require('../models/User');
const Doctor =require('../models/Doctor')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message:'user created succesfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token ,userId: user._id,message:'user login succesfull' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.doctorLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const doctor = await Doctor.findOne({ username });

    if (!doctor) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is already hashed in the database
    if (!doctor.password.startsWith('$2a$')) {
      // If not hashed, hash the plain text password and update in the database
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      doctor.password = hashedPassword;
      await doctor.save();
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If password matches, generate token (and continue with login steps)
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};